import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm'

export class InitDb1718445801 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Diary
    await queryRunner.createTable(
      new Table({
        name: 'Diary',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()'
          },
          {
            name: 'createdDate',
            type: 'timestamp',
            default: 'NOW()'
          },
          {
            name: 'updatedDate',
            type: 'timestamp',
            default: 'NOW()'
          },
          {
            name: 'text',
            type: 'varchar',
            default: ''
          },
          {
            name: 'day',
            type: 'int'
          },
          {
            name: 'month',
            type: 'int'
          },
          {
            name: 'year',
            type: 'int'
          }
        ]
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables
    await queryRunner.dropTable('Diary', true)
  }
}
