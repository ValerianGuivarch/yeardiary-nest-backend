import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm'

export class Battle1703177293144 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Battle',
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
            name: 'currentTurn',
            type: 'integer',
            default: 0
          },
          {
            name: 'alreadyActedCharacters',
            type: 'text',
            isArray: true,
            default: "'{}'"
          },
          {
            name: 'strongElement',
            type: 'varchar'
          },
          {
            name: 'weakElement',
            type: 'varchar'
          },
          {
            name: 'isOver',
            type: 'boolean',
            default: false
          }
        ]
      })
    )

    await queryRunner.addColumn(
      'Character',
      new TableColumn({
        name: 'damageTaken',
        type: 'integer',
        default: 0
      })
    )

    await queryRunner.createTable(
      new Table({
        name: 'CharacterBattle',
        columns: [
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
            name: 'characterId',
            type: 'uuid',
            isNullable: false,
            isPrimary: true
          },
          {
            name: 'battleId',
            type: 'uuid',
            isNullable: false,
            isPrimary: true
          }
        ],
        foreignKeys: [
          {
            name: 'FK_character_battle_character',
            columnNames: ['characterId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Character',
            onDelete: 'CASCADE'
          },
          {
            name: 'FK_character_battle_battle',
            columnNames: ['battleId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Battle',
            onDelete: 'CASCADE'
          }
        ]
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('CharacterBattle')
    await queryRunner.dropTable('Battle')
    await queryRunner.dropColumn('Character', 'damageTaken')
  }
}
