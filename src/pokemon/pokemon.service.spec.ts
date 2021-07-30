import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pokemon } from './pokemon.entity';
import { PokemonService } from './pokemon.service';
import TestUtil from './../common/test/TestUtil';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('PokemonService', () => {
  let service: PokemonService;

  const mockRepository = {
    find: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PokemonService],
      providers: [
        PokemonService,
        {
          provide: getRepositoryToken(Pokemon),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search All Pokemons', () => {
    it('should be list all pokemons', async () => {
      const pokemon = TestUtil.giveAMeAValidPokemon();
      mockRepository.find.mockReturnValue([pokemon, pokemon]);
      const pokemons = await service.findAllPokemons();
      expect(pokemons).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When serch Pokemon By Id', () => {
    it('should find a existing pokemon', async () => {
      const pokemon = TestUtil.giveAMeAValidPokemon();
      mockRepository.findOneOrFail.mockReturnValue(pokemon);
      const pokemonFound = await service.findByIdPokemon(1);
      expect(pokemonFound).toMatchObject({ name: pokemon.name });
      expect(mockRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a user', async () => {
      mockRepository.findOneOrFail.mockReturnValue(null);
      expect(service.findByIdPokemon(3)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create pokemon', () => {
    it('should create a pokemon', async () => {
      const pokemon = TestUtil.giveAMeAValidPokemon();
      mockRepository.save.mockReturnValue(pokemon);
      mockRepository.create.mockReturnValue(pokemon);
      const savedPokemon = await service.createPokemon(pokemon);

      expect(savedPokemon).toMatchObject(pokemon);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
    it('should return a exception when doesnt create a pokemon', async () => {
      const pokemon = TestUtil.giveAMeAValidPokemon();
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(pokemon);

      await service.createPokemon(pokemon).catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problem to create a pokemon. Try again',
        });
      });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });
  describe('When update Pokemon', () => {
    it('Should update a pokemon', async () => {
      const pokemon = TestUtil.giveAMeAValidPokemon();
      const updatedPokemon = { name: 'Nome Atualizado' };
      mockRepository.findOneOrFail.mockReturnValue(pokemon);
      mockRepository.update.mockReturnValue({
        ...pokemon,
        ...updatedPokemon,
      });
      mockRepository.create.mockReturnValue({
        ...pokemon,
        ...updatedPokemon,
      });

      const resultPokemon = await service.updatePokemon(1, {
        ...pokemon,
        name: 'Nome Atualizado',
      });

      expect(resultPokemon).toMatchObject(updatedPokemon);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.findOneOrFail).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledTimes(1);
    });
  });

  describe('When delete Pokemon', () => {
    it('Should delete a existing pokemon', async () => {
      const pokemon = TestUtil.giveAMeAValidPokemon();
      mockRepository.delete.mockReturnValue(pokemon);
      mockRepository.findOneOrFail.mockReturnValue(pokemon);

      const deletedPokemon = await service.deletePokemon(1);

      expect(deletedPokemon).toBe(true);
      expect(mockRepository.findOneOrFail).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });

    it('Should not delete a inexisting pokemon', async () => {
      const pokemon = TestUtil.giveAMeAValidPokemon();
      mockRepository.delete.mockReturnValue(null);
      mockRepository.findOneOrFail.mockReturnValue(pokemon);

      const deletedPokemon = await service.deletePokemon(7);

      expect(deletedPokemon).toBe(false);
      expect(mockRepository.findOneOrFail).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });
  });
});
