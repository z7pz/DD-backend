export interface IGuild {
  id: string;
  name: string;
  icon: string;
  owner: string;
  permissions: number;
  features: string[];
}
