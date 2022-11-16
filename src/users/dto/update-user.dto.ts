import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    nombre: string;
    contrasena: string;
    user: string;
    correo: string;
}
