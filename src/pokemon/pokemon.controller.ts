import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreatePokemonInput } from './dto/create-pokemon-input';
import { Pokemon } from './pokemon.entity';
import { PokemonService } from './pokemon.service';

const ackErrors: string[] = ['E11000'];

@Controller('pokemon')
export class PokemonController {
  constructor(private pokemonService: PokemonService) {}

  @EventPattern('create-pokemon')
  async createPokemon(
    @Payload() input: CreatePokemonInput,
    @Ctx() context: RmqContext,
  ): Promise<Pokemon> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    let confirmation = true;

    try {
      return await this.pokemonService.createPokemon(input);
    } catch (error) {
      confirmation = false;
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    } finally {
      if (confirmation) await channel.ack(originalMsg);
    }
  }

  @MessagePattern('find-all-pokemons')
  async findAllPokemons(@Ctx() context: RmqContext): Promise<Pokemon[]> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return await this.pokemonService.findAllPokemons();
    } catch (error) {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('find-by-id-pokemon')
  async findByIdPokemon(
    @Payload() pokemonId: number,
    @Ctx() context: RmqContext,
  ): Promise<Pokemon> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      return await this.pokemonService.findByIdPokemon(pokemonId);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('delete-pokemon')
  async deletarPokemon(
    @Payload() pokemonId: number,
    @Ctx() context: RmqContext,
  ): Promise<boolean> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    let confirmation = true;

    try {
      return await this.pokemonService.deletePokemon(pokemonId);
    } catch (error) {
      confirmation = false;
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    } finally {
      if (confirmation) await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-pokemon')
  async updatePokemon(
    @Payload() input: any,
    @Ctx() context: RmqContext,
  ): Promise<Pokemon> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    let confirmation = true;

    const { pokemonId, updatePokemonInput } = input;

    try {
      return await this.pokemonService.updatePokemon(
        pokemonId,
        updatePokemonInput,
      );
    } catch (error) {
      confirmation = false;
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    } finally {
      if (confirmation) await channel.ack(originalMsg);
    }
  }
}
