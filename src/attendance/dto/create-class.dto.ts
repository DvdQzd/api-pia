import { User } from "src/users/schemas/user.schema";

export class CreateClassDto {
    ramo: string;
    descripcion: string;
    fechaInicio: Date;
    profesor: User;
    alumnos: User[];
}
