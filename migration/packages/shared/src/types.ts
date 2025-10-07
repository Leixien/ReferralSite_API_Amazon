// Re-export types for convenience
export type {
  SearchRequest,
  SearchResponse,
  Product,
  Price,
  Rating,
  ErrorResponse,
  HealthCheck,
} from './schemas';

// Amazon API response types (raw from API)
export interface AmazonSearchItemsResponse {
  SearchResult?: {
    Items?: AmazonItem[];
    TotalResultCount?: number;
  };
  Errors?: Array<{
    Code: string;
    Message: string;
  }>;
}

export interface AmazonItem {
  ASIN: string;
  DetailPageURL: string;
  Images?: {
    Primary?: {
      Large?: {
        URL: string;
      };
    };
  };
  ItemInfo?: {
    Title?: {
      DisplayValue: string;
    };
    ByLineInfo?: {
      Brand?: {
        DisplayValue: string;
      };
    };
    Features?: {
      DisplayValues: string[];
    };
  };
  Offers?: {
    Listings?: Array<{
      Price?: {
        Amount: number;
        Currency: string;
        DisplayAmount: string;
      };
      SavingBasis?: {
        Amount: number;
        Currency: string;
        DisplayAmount: string;
      };
      ProgramEligibility?: {
        IsPrimeExclusive: boolean;
        IsPrimePantry: boolean;
      };
    }>;
  };
  CustomerReviews?: {
    StarRating?: {
      Value: number;
    };
    Count?: number;
  };
}

// Categories mapping
export const AMAZON_CATEGORIES = {
  All: 'Tutte',
  Electronics: 'Elettronica',
  Computers: 'Computer',
  VideoGames: 'Videogiochi',
  OfficeProducts: 'Ufficio',
  Furniture: 'Mobili',
  HomeAndKitchen: 'Casa e Cucina',
  Sports: 'Sport',
  ToysAndGames: 'Giochi',
} as const;

export type AmazonCategory = keyof typeof AMAZON_CATEGORIES;
