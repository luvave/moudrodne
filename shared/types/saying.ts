export interface Saying {
  text?: string;
  description?: string;
  preferredDate?: string;
  image?: string;
}

export interface SayingCreate {
  text: string;
  description: string;
  preferredDate?: Date;
  image?: string;
}
