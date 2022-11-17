import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @HttpCode(200)
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() login: LoginDto) {
    const { user, contrasena } = login;
    const userFromDB = await this.usersService.findUserByUser(user);
    if (userFromDB) {
      if (userFromDB.contrasena === contrasena) {
        delete userFromDB.contrasena
        return userFromDB;
      }
      throw new HttpException('Contraseña incorrecta', HttpStatus.UNAUTHORIZED);
    }
    throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
  }
}
