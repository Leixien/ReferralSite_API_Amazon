import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto-js';
import { config } from '@/config';
import { logger } from '@/config/logger';
import type { AmazonSearchItemsResponse } from '@referral-site/shared';

export class AmazonService {
  private readonly baseUrl = 'https://webservices.amazon.it/paapi5/searchitems';
  private readonly serviceName = 'ProductAdvertisingAPI';
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }

  /**
   * Search for items on Amazon
   */
  async searchItems(params: {
    keywords: string;
    maxPrice?: number;
    category?: string;
    itemCount?: number;
    primeOnly?: boolean;
    discountOnly?: boolean;
  }): Promise<AmazonSearchItemsResponse> {
    try {
      const requestBody = this.buildSearchRequest(params);
      const headers = this.generateAwsSignature(requestBody);

      const response = await this.client.post<AmazonSearchItemsResponse>(
        this.baseUrl,
        requestBody,
        { headers }
      );

      return response.data;
    } catch (error: any) {
      logger.error({ error, params }, 'Amazon API search failed');
      
      if (error.response?.data?.Errors) {
        throw new Error(error.response.data.Errors[0]?.Message || 'Amazon API error');
      }
      
      throw new Error('Failed to search Amazon products');
    }
  }

  /**
   * Build the search request payload
   */
  private buildSearchRequest(params: {
    keywords: string;
    maxPrice?: number;
    category?: string;
    itemCount?: number;
    primeOnly?: boolean;
    discountOnly?: boolean;
  }) {
    const body: any = {
      PartnerTag: config.amazon.associateTag,
      PartnerType: 'Associates',
      Keywords: params.keywords,
      SearchIndex: params.category || 'All',
      ItemCount: params.itemCount || 10,
      Resources: [
        'Images.Primary.Large',
        'ItemInfo.Title',
        'ItemInfo.Features',
        'ItemInfo.ByLineInfo',
        'Offers.Listings.Price',
        'Offers.Listings.SavingBasis',
        'Offers.Listings.ProgramEligibility.IsPrimeExclusive',
        'CustomerReviews.StarRating',
        'CustomerReviews.Count',
      ],
    };

    // Add filters
    if (params.maxPrice) {
      body.MaxPrice = params.maxPrice * 100; // Amazon expects cents
    }

    if (params.primeOnly) {
      body.DeliveryFlags = ['Prime'];
    }

    return body;
  }

  /**
   * Generate AWS Signature Version 4
   */
  private generateAwsSignature(payload: any): Record<string, string> {
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substr(0, 8);

    const host = 'webservices.amazon.it';
    const canonicalUri = '/paapi5/searchitems';
    const canonicalQuerystring = '';
    const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${host}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'content-type;host;x-amz-date';

    const payloadHash = crypto.SHA256(JSON.stringify(payload)).toString(crypto.enc.Hex);

    const canonicalRequest = [
      'POST',
      canonicalUri,
      canonicalQuerystring,
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join('\n');

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${config.amazon.region}/${this.serviceName}/aws4_request`;
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      crypto.SHA256(canonicalRequest).toString(crypto.enc.Hex),
    ].join('\n');

    const signingKey = this.getSignatureKey(
      config.amazon.secretKey,
      dateStamp,
      config.amazon.region,
      this.serviceName
    );

    const signature = crypto.HmacSHA256(stringToSign, signingKey).toString(crypto.enc.Hex);

    const authorizationHeader = `${algorithm} Credential=${config.amazon.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Amz-Date': amzDate,
      'Authorization': authorizationHeader,
      'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
      'Content-Encoding': 'amz-1.0',
    };
  }

  /**
   * Generate signing key for AWS Signature V4
   */
  private getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string) {
    const kDate = crypto.HmacSHA256(dateStamp, 'AWS4' + key);
    const kRegion = crypto.HmacSHA256(regionName, kDate);
    const kService = crypto.HmacSHA256(serviceName, kRegion);
    const kSigning = crypto.HmacSHA256('aws4_request', kService);
    return kSigning;
  }

  /**
   * Generate affiliate link
   */
  generateAffiliateLink(asin: string): string {
    return `https://${config.amazon.marketplace}/dp/${asin}?tag=${config.amazon.associateTag}`;
  }
}

export const amazonService = new AmazonService();
