import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm'

export class InitDb1698398468721 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Account
    await queryRunner.createTable(
      new Table({
        name: 'Account',
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
            name: 'authority',
            type: 'varchar',
            default: "'USER'"
          },
          {
            name: 'secret',
            type: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'creationState',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true
          },
          {
            name: 'phoneNumber',
            type: 'varchar',
            isUnique: true,
            isNullable: true
          },
          {
            name: 'username',
            type: 'varchar'
          },
          {
            name: 'firstname',
            type: 'varchar'
          },
          {
            name: 'lastname',
            type: 'varchar'
          }
        ]
      }),
      true
    )

    // Character
    await queryRunner.createTable(
      new Table({
        name: 'Character',
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
            name: 'level',
            type: 'integer',
            default: 1
          },
          {
            name: 'accountId',
            type: 'uuid',
            isNullable: false,
            isUnique: false
          },
          {
            name: 'invokerId',
            type: 'uuid',
            isNullable: true,
            isUnique: false
          },
          {
            name: 'picture',
            type: 'varchar',
            isNullable: true
          }
        ],
        foreignKeys: [
          {
            name: 'FK_character_account',
            columnNames: ['accountId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Account',
            onDelete: 'CASCADE'
          },
          {
            name: 'FK_character_invoker',
            columnNames: ['invokerId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Character',
            onDelete: 'SET NULL'
          }
        ]
      }),
      true
    )

    await queryRunner.createTable(
      new Table({
        name: 'Classe',
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
          }
        ]
      }),
      true
    )

    // Guild
    await queryRunner.createTable(
      new Table({
        name: 'Guild',
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
          }
        ]
      }),
      true
    )

    await queryRunner.createTable(
      new Table({
        name: 'GuildMember',
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
            name: 'rank',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'characterId',
            type: 'uuid',
            isPrimary: true, // Défini comme clé primaire
            isNullable: false
          },
          {
            name: 'guildId',
            type: 'uuid',
            isPrimary: true, // Défini comme clé primaire
            isNullable: false
          }
        ],
        foreignKeys: [
          {
            name: 'FK_guild_member_character',
            columnNames: ['characterId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Character',
            onDelete: 'CASCADE'
          },
          {
            name: 'FK_guild_member_guild',
            columnNames: ['guildId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Guild',
            onDelete: 'CASCADE'
          }
        ]
      }),
      true
    )

    // CharacterClasse
    await queryRunner.createTable(
      new Table({
        name: 'CharacterClasse',
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
            name: 'level',
            type: 'integer',
            default: 1
          },
          {
            name: 'characterId',
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
            name: 'FK_classe_level_character',
            columnNames: ['characterId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Character',
            onDelete: 'CASCADE'
          },
          {
            name: 'FK_classe_level_classe',
            columnNames: ['classeId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Classe',
            onDelete: 'CASCADE'
          }
        ]
      }),
      true
    )

    await queryRunner.createPrimaryKey(
      'CharacterClasse',
      ['characterId', 'classeId'],
      'PK_classe_level_character_classe'
    )

    // AuthenticationMethod
    await queryRunner.createTable(
      new Table({
        name: 'AuthenticationMethod',
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
            name: 'accountId',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false
          }
        ],
        foreignKeys: [
          {
            name: 'FK_authentication_method_account',
            columnNames: ['accountId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Account',
            onDelete: 'CASCADE'
          }
        ]
      }),
      true
    )

    // Additions for AuthenticationWithGoogle
    await queryRunner.addColumn(
      'AuthenticationMethod',
      new TableColumn({
        name: 'googleId',
        type: 'varchar',
        isNullable: true
      })
    )

    await queryRunner.addColumn(
      'AuthenticationMethod',
      new TableColumn({
        name: 'hashedRefreshToken',
        type: 'varchar',
        isNullable: true
      })
    )

    // Additions for AuthenticationWithMailPassword
    await queryRunner.addColumn(
      'AuthenticationMethod',
      new TableColumn({
        name: 'hashedPassword',
        type: 'varchar',
        isNullable: true
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop Primary keys
    await queryRunner.dropPrimaryKey('CharacterClasse', 'PK_classe_level_character_classe')

    // Drop tables
    await queryRunner.dropTable('CharacterClasse', true)
    await queryRunner.dropTable('GuildMember', true)
    await queryRunner.dropTable('Guild', true)
    await queryRunner.dropTable('Classe', true)
    await queryRunner.dropTable('Character', true)
    await queryRunner.dropTable('Account', true)
    await queryRunner.dropTable('AuthenticationMethod', true)
  }
}
