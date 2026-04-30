export class CreateExternalSiteDto {
  name: string;
  url: string;
  logoUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}