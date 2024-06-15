import { MigrationInterface, TableColumn, TableForeignKey, QueryRunner, Table } from 'typeorm'

export class InitRaces1698933061831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Race',
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
            name: 'name',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'sleep',
            type: 'boolean',
            default: true
          },
          {
            name: 'size',
            type: 'varchar',
            isNullable: false
          }
        ]
      }),
      true
    )

    await queryRunner.addColumn(
      'Character',
      new TableColumn({
        name: 'raceId',
        type: 'uuid',
        isNullable: false
      })
    )

    await queryRunner.createForeignKey(
      'Character',
      new TableForeignKey({
        name: 'FK_character_race',
        columnNames: ['raceId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Race'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('Character', 'FK_character_race')
    await queryRunner.dropColumn('Character', 'raceId')
    await queryRunner.dropTable('Race')
  }
}
