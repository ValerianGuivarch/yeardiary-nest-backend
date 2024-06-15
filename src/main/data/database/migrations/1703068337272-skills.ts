import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class Skills1703068337272 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Skill',
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
            type: 'varchar'
          },
          {
            name: 'description',
            type: 'varchar'
          },
          {
            name: 'damage',
            type: 'integer'
          },
          {
            name: 'minimumLevel',
            type: 'integer'
          },
          {
            name: 'type',
            type: 'varchar'
          },
          {
            name: 'element',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'spellLevel',
            type: 'integer',
            isNullable: true
          },
          {
            name: 'weaponType',
            type: 'varchar',
            isNullable: true
          }
        ]
      })
    )

    await queryRunner.createTable(
      new Table({
        name: 'ClasseSkill',
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
            name: 'minimumClasseLevel',
            type: 'integer',
            default: 0
          },
          {
            name: 'skillId',
            type: 'uuid',
            isNullable: false,
            isUnique: false
          },
          {
            name: 'classeId',
            type: 'uuid',
            isNullable: false,
            isUnique: false
          }
        ],
        foreignKeys: [
          {
            name: 'FK_classe_skill_skill',
            columnNames: ['skillId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Skill',
            onDelete: 'CASCADE'
          },
          {
            name: 'FK_classe_skill_classe',
            columnNames: ['classeId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Classe',
            onDelete: 'CASCADE'
          }
        ]
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ClasseSkill')
    await queryRunner.dropTable('Skill')
  }
}
