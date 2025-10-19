import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', { schema: 'public' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'email', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'api_key', length: 255, unique: true })
  api_key: string;

  @Column({ type: 'json', name: 'repositories' })
  repositories: Array<string>;
}
