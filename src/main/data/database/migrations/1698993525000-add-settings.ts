import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class AddSettings1698993525000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Setting',
        columns: [
          {
            name: 'type',
            type: 'varchar',
            isPrimary: true
          },
          {
            name: 'value',
            type: 'json'
          }
        ]
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Setting')
  }
}
