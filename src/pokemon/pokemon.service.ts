import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePokemonInput } from './dto/create-pokemon-input';
import { UpdatePokemonInput } from './dto/update-pokemon-input';
import { Pokemon } from './pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  async createPokemon(input: CreatePokemonInput): Promise<Pokemon> {
    try {
      const pokemon = await this.pokemonRepository.create(input);
      const pokemonSalvo = await this.pokemonRepository.save(pokemon);

      if (!pokemonSalvo) {
        throw new InternalServerErrorException(
          'Problem when trying to create a pokemon',
        );
      }

      return pokemon;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
  async findAllPokemons(): Promise<Pokemon[]> {
    try {
      return await this.pokemonRepository.find();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async findByIdPokemon(pokemonId: number): Promise<Pokemon | null> {
    try {
      return await this.pokemonRepository.findOneOrFail(pokemonId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
  
  async deletePokemon(pokemonId: number): Promise<boolean> {
    try {
      const deleted = await this.pokemonRepository.delete(pokemonId);
      return !!deleted;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async updatePokemon(pokemonId: number, input: UpdatePokemonInput): Promise<Pokemon> {
    try {
      const pokemon = await this.findByIdPokemon(pokemonId);

      await this.pokemonRepository.update(pokemon, { ...input });

      const pokemonUpdated = this.pokemonRepository.create({
        ...pokemon,
        ...input,
      });

      return pokemonUpdated;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
