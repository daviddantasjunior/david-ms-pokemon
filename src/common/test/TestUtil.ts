import { Pokemon } from './../../pokemon/pokemon.entity';
import { User } from './../../user/user.schema';
export default class TestUtil {
  static giveAMeAValidPokemon(): Pokemon {
    const pokemon = new Pokemon();
    pokemon.type = 'esperto';
    pokemon.name = 'Pikachu';
    pokemon.pokemonId = 1;
    return pokemon;
  }
  static giveAMeAValidUser(): User {
    const user = new User();
    user.nickname = 'david.junior';
    user.password = '123eR@45678';
    user.mail = 'david@pokemon.com';
    return user;
  }
}
