import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    const users = [
      { name: 'Giorgi', gender: 'male' },
      { name: 'Ana', gender: 'female' },
      { name: 'Giorgi', gender: 'male' },
      { name: 'Irakli', gender: 'male' },
      { name: 'Tekla', gender: 'female' },
      { name: 'Omar', gender: 'male' },
      { name: 'Maria', gender: 'female' },
    ];

    const sortedData = { males: [], females: [] };

    for (let i = 0; i < users.length; i++) {
      if (users[i].gender === 'male') {
        // @ts-ignore
        sortedData.males.push(users[i]);
      } else {
        // @ts-ignore
        sortedData.females.push(users[i]);
      }
    }

    return sortedData;
  }

  @Post()
  login(@Body() requestData: { email: string; password: string }) {
    // performLogin();
    // Imagine if this was full login flow.
    console.log(requestData);
  }
}
