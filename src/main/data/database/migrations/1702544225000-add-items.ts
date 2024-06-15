import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class AddItems1702544225000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Item',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            default: 'uuid_generate_v4()'
          },
          {
            name: 'characterId',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'createdDate',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updatedDate',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'used',
            type: 'boolean',
            default: true
          }
        ],
        foreignKeys: [
          {
            columnNames: ['characterId'],
            referencedTableName: 'Character',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE'
          }
        ]
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Item')
  }
}
