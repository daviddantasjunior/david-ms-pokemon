import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pokemon')
export class Pokemon {
  @PrimaryGeneratedColumn('increment')
  pokemonId: number;

  @Column()
  name: string;

  @Column()
  type: string;
}
