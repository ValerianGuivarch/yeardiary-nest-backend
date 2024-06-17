import { DiaryVM, DiaryVMExample } from './entities/DiaryVM'
import { CreateDiaryRequest } from './requests/CreateDiaryRequest'
import { UpdateDiaryRequest } from './requests/UpdateDiaryRequest'
import { Diary } from '../../../../../domain/models/diaries/Diary'
import { DiaryService } from '../../../../../domain/services/entities/diaries/DiaryService'
import { generatePageResponseContent } from '../../utils/swagger'
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { GetDiaryRequest } from './requests/GetDiaryRequest'

@Controller('api/v1/diaries')
@ApiTags('Diaries')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @ApiCreatedResponse({
    description: 'Create a new diary for account',
    type: DiaryVM
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async createNewDiary(@Body() request: CreateDiaryRequest): Promise<DiaryVM> {
    return DiaryVM.from(
      await this.diaryService.createDiary(
        Diary.toDiaryToCreate({
          text: request.text,
          day: request.day,
          month: request.month,
          year: request.year
        })
      )
    )
  }

  @ApiOkResponse({
    description: 'Get all diaries',
    content: generatePageResponseContent({
      types: DiaryVM,
      examples: {
        Diaries: DiaryVMExample
      }
    })
  })
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getManyDiariesByDayAndMonth(@Query() getDiaryRequest: GetDiaryRequest): Promise<DiaryVM[]> {
    const diaries = await this.diaryService.getManyDiariesByDayAndMonth({
      day: getDiaryRequest.day,
      month: getDiaryRequest.month
    })
    return diaries.map(DiaryVM.from)
  }

  @ApiOkResponse({
    description: 'Update a diary',
    type: DiaryVM
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Put(':diaryId')
  async updateDiaryById(@Param('diaryId') diaryId: string, @Body() request: UpdateDiaryRequest): Promise<DiaryVM> {
    return DiaryVM.from(
      await this.diaryService.updateDiary({
        diaryId: diaryId,
        diaryToUpdate: {
          text: request.text
        }
      })
    )
  }

  @ApiOkResponse({
    description: 'Get all missing entries',
  })
  @HttpCode(HttpStatus.OK)
  @Get('/missing')
  async findAllMissingEntries(): Promise<{
    day: number
    month: number
    year: number
  }[]> {
    const missingEntries = await this.diaryService.findAllMissingEntries()
    return missingEntries.map(DiaryVM.from)
  }
}
