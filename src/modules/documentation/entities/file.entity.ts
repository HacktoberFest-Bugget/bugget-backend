import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files', { schema: 'public' })
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'repository', length: 255 })
  repository: string;

  @Column({ type: 'varchar', name: 'filename', length: 255, unique: true })
  filename: string;

  @Column({ type: 'text', name: 'content' })
  content: string;

  @Column({
    type: 'date',
    name: 'date',
    nullable: true,
    default: new Date(),
  })
  date?: Date;
}
