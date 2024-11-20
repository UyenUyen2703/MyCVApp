import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;
@Schema()
export class User {
    @Prop({ required: true })
    googleId: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    role: string;

    @Prop({ required: true })
    avatar: string;
}
export const UserSchema = SchemaFactory.createForClass(User);