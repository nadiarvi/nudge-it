import { User } from "./user";

export interface Message {
    id: string;
    senderType: string;
    sender: string;
    receiver: string;
    content: string;
    timestamp: Date;
}

export interface ChatItemProps {
  id: string;
  type: string;
  people: User[];
  group_id: string;
  about: null;
  messages: Message[];
}