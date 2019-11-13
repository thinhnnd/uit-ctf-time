import { Controller, Get, Req, Post, UseGuards, Body, Render } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }
  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }
}
