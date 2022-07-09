export class User {
  _id?: string;
  name: string = '';
  lastName: string = '';
  description: string = ''
  email: string = '';
  status: string = '';
  password: string = '';
  // token: string = '';
  selected: boolean = false;
  messages: string = '';
  createdAt: Date;
  messageCount: number;
  typing: boolean;
  phoneNumber: string
  DOB: Date
}
