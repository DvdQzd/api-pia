import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    nombre: string;

    @Prop()
    contrasena: string;

    @Prop()
    user: string;

    @Prop()
    correo: string;
}

export const UserSchema = SchemaFactory.createForClass(User);