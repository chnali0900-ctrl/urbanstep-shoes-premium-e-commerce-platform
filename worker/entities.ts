import { IndexedEntity } from "./core-utils";
import type { ShoeProduct, Order, User, Chat, ChatMessage } from "@shared/types";
import { PRODUCTS } from "../src/lib/data";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS } from "@shared/mock-data";
export class ProductEntity extends IndexedEntity<ShoeProduct> {
  static readonly entityName = "product";
  static readonly indexName = "products";
  static readonly initialState: ShoeProduct = {
    id: "",
    name: "",
    price: 0,
    category: "Sneakers",
    gender: "Unisex",
    description: "",
    images: [],
    sizes: [],
    colors: []
  };
  static seedData = PRODUCTS;
}
export class OrderEntity extends IndexedEntity<Order> {
  static readonly entityName = "order";
  static readonly indexName = "orders";
  static readonly initialState: Order = {
    id: "",
    customerName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    items: [],
    totalAmount: 0,
    status: "Pending",
    createdAt: 0
  };
}
// Template compatibility entities
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}