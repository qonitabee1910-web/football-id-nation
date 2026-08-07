/**
 * IDN-INFRA-001: ADAPTER & MAPPER LAYERS
 * 
 * DERIVED FROM:
 * - EPOS-CORE-DOC-001 (Data Transformation Architecture)
 * - IDN-CDM-001 (Canonical Data Model)
 * - IDN-API-001 (API Contracts)
 * 
 * PURPOSE:
 * Centralized data transformation patterns for adapters and mappers.
 * These base classes are extended by each feature module.
 * 
 * RESPONSIBILITIES:
 * - Transform API responses to domain models
 * - Transform API requests from domain models
 * - Transform DTOs to/from domain models
 * - Transform domain models to view models
 * - Bidirectional mapping
 * 
 * ARCHITECTURAL PATTERN:
 * 
 * API Response → API Adapter → DTO → DTO Mapper → Domain Model
 *                                                      ↓
 *                                            Domain Service Logic
 *                                                      ↓
 *                            Presentation Mapper → View Model
 *                                                      ↓
 *                                          React Component Render
 * 
 * NO BUSINESS LOGIC - This is purely data transformation.
 * Every feature module follows this pattern.
 * 
 * STATUS: Enterprise Mandatory Baseline v1.0
 */

// =========================================================================
// BASE ADAPTER INTERFACE
// =========================================================================

/**
 * Base adapter interface for data transformation
 */
export interface Adapter<From, To> {
  /**
   * Transform data from source format to target format
   */
  adapt(data: From): To;

  /**
   * Transform array of data
   */
  adaptMany(data: From[]): To[];

  /**
   * Reverse transform (if bidirectional)
   */
  reverse?(data: To): From;
  reversMany?(data: To[]): From[];
}

/**
 * Base adapter abstract class with common functionality
 */
export abstract class BaseAdapter<From, To> implements Adapter<From, To> {
  abstract adapt(data: From): To;

  adaptMany(data: From[]): To[] {
    return data.map((item) => this.adapt(item));
  }

  reverse?(data: To): From;
  reversMany?(data: To[]): From[];
}

// =========================================================================
// BASE MAPPER INTERFACE
// =========================================================================

/**
 * Base mapper interface for entity transformation
 */
export interface Mapper<Entity, DTO> {
  /**
   * Transform entity to DTO
   */
  toPersistence(entity: Entity): DTO;

  /**
   * Transform DTO to entity
   */
  toDomain(dto: DTO): Entity;

  /**
   * Batch operations
   */
  toPersistenceMany(entities: Entity[]): DTO[];
  toDomainMany(dtos: DTO[]): Entity[];
}

/**
 * Base mapper abstract class with common functionality
 */
export abstract class BaseMapper<Entity, DTO> implements Mapper<Entity, DTO> {
  abstract toPersistence(entity: Entity): DTO;
  abstract toDomain(dto: DTO): Entity;

  toPersistenceMany(entities: Entity[]): DTO[] {
    return entities.map((entity) => this.toPersistence(entity));
  }

  toDomainMany(dtos: DTO[]): Entity[] {
    return dtos.map((dto) => this.toDomain(dto));
  }
}

// =========================================================================
// API ADAPTER
// =========================================================================

/**
 * Adapter for transforming API responses to DTOs
 * 
 * USAGE PATTERN:
 * 
 * // In features/identity/adapters/player-api.adapter.ts
 * export class PlayerAPIAdapter extends APIAdapter<PlayerResponse, PlayerDTO> {
 *   adapt(response: PlayerResponse): PlayerDTO {
 *     return {
 *       id: response.player_id,
 *       firstName: response.first_name,
 *       lastName: response.last_name,
 *       dateOfBirth: new Date(response.dob),
 *     };
 *   }
 * }
 * 
 * // Usage
 * const adapter = new PlayerAPIAdapter();
 * const playerDTO = adapter.adapt(apiResponse);
 */

export abstract class APIAdapter<APIResponse, DTO> extends BaseAdapter<APIResponse, DTO> {
  /**
   * Transform API response to DTO
   */
  abstract adapt(data: APIResponse): DTO;

  /**
   * Reverse transform DTO to API request
   */
  abstract reverse?(data: DTO): APIResponse;
}

// =========================================================================
// DTO MAPPER
// =========================================================================

/**
 * Mapper for transforming DTOs to/from Domain Models
 * 
 * DTO (Data Transfer Object) represents database/API shape
 * Domain Model represents business domain
 * 
 * USAGE PATTERN:
 * 
 * // In features/identity/mappers/player.mapper.ts
 * export class PlayerMapper extends DTOMapper<Player, PlayerDTO> {
 *   toDomain(dto: PlayerDTO): Player {
 *     return new Player({
 *       id: dto.id,
 *       name: new Name(dto.firstName, dto.lastName),
 *       birthDate: dto.dateOfBirth,
 *     });
 *   }
 * 
 *   toPersistence(player: Player): PlayerDTO {
 *     return {
 *       id: player.id,
 *       firstName: player.name.first,
 *       lastName: player.name.last,
 *       dateOfBirth: player.birthDate,
 *     };
 *   }
 * }
 * 
 * // Usage
 * const mapper = new PlayerMapper();
 * const player = mapper.toDomain(playerDTO); // Business logic
 * const dto = mapper.toPersistence(player);  // Save to DB
 */

export abstract class DTOMapper<Entity, DTO> extends BaseMapper<Entity, DTO> {
  /**
   * Transform DTO to domain entity
   */
  abstract toDomain(dto: DTO): Entity;

  /**
   * Transform domain entity to DTO
   */
  abstract toPersistence(entity: Entity): DTO;
}

// =========================================================================
// VIEW MODEL MAPPER
// =========================================================================

/**
 * Mapper for transforming Domain Models to View Models
 * 
 * Domain Model represents business domain
 * View Model represents UI presentation
 * 
 * USAGE PATTERN:
 * 
 * // In features/identity/mappers/player-view.mapper.ts
 * export class PlayerViewMapper extends ViewModelMapper<Player, PlayerView> {
 *   toView(entity: Player): PlayerView {
 *     return {
 *       id: entity.id,
 *       displayName: `${entity.name.first} ${entity.name.last}`,
 *       age: this.calculateAge(entity.birthDate),
 *       registrationStatus: this.formatStatus(entity.status),
 *     };
 *   }
 * 
 *   toDomain(view: PlayerView): Player {
 *     // Reverse transform (if needed)
 *     throw new Error('View-to-Domain not supported');
 *   }
 * }
 */

export abstract class ViewModelMapper<Entity, ViewModel> {
  /**
   * Transform domain entity to view model
   */
  abstract toView(entity: Entity): ViewModel;

  /**
   * Transform array of entities to view models
   */
  toViewMany(entities: Entity[]): ViewModel[] {
    return entities.map((entity) => this.toView(entity));
  }

  /**
   * Reverse transform (optional, may not be supported)
   */
  toDomain?(view: ViewModel): Entity;
  toDomainMany?(views: ViewModel[]): Entity[];
}

// =========================================================================
// TRANSFORMATION PIPELINE
// =========================================================================

/**
 * Combine adapters and mappers into a pipeline
 * 
 * USAGE PATTERN:
 * 
 * // Create pipeline
 * const pipeline = new TransformationPipeline<APIResponse, PlayerDTO, Player>()
 *   .addAdapter(new PlayerAPIAdapter())
 *   .addMapper(new PlayerMapper());
 * 
 * // Use pipeline
 * const player = pipeline.transform(apiResponse);
 */

export class TransformationPipeline<APIResponse, DTO, Entity> {
  private adapter?: APIAdapter<APIResponse, DTO>;
  private mapper?: DTOMapper<Entity, DTO>;

  addAdapter(adapter: APIAdapter<APIResponse, DTO>): this {
    this.adapter = adapter;
    return this;
  }

  addMapper(mapper: DTOMapper<Entity, DTO>): this {
    this.mapper = mapper;
    return this;
  }

  /**
   * Transform API response → DTO → Entity
   */
  transform(apiResponse: APIResponse): Entity {
    if (!this.adapter || !this.mapper) {
      throw new Error('Pipeline not fully configured');
    }

    const dto = this.adapter.adapt(apiResponse);
    return this.mapper.toDomain(dto);
  }

  /**
   * Transform array of API responses
   */
  transformMany(apiResponses: APIResponse[]): Entity[] {
    return apiResponses.map((response) => this.transform(response));
  }

  /**
   * Reverse transform Entity → DTO → APIRequest
   */
  reverseTransform(entity: Entity): APIResponse {
    if (!this.adapter || !this.mapper) {
      throw new Error('Pipeline not fully configured');
    }

    if (!this.adapter.reverse || !this.mapper.toPersistence) {
      throw new Error('Reverse transformation not supported');
    }

    const dto = this.mapper.toPersistence(entity);
    return this.adapter.reverse(dto);
  }

  /**
   * Reverse transform array of entities
   */
  reverseTransformMany(entities: Entity[]): APIResponse[] {
    return entities.map((entity) => this.reverseTransform(entity));
  }
}

// =========================================================================
// BATCH TRANSFORMATION
// =========================================================================

/**
 * Transform multiple items in parallel (if async operations)
 */
export async function transformBatch<From, To>(
  items: From[],
  transformer: (item: From) => Promise<To>
): Promise<To[]> {
  return Promise.all(items.map(transformer));
}

/**
 * Transform with error handling
 */
export async function transformBatchSafe<From, To>(
  items: From[],
  transformer: (item: From) => Promise<To>
): Promise<{ successes: To[]; failures: Array<{ item: From; error: Error }> }> {
  const results = await Promise.allSettled(items.map(transformer));

  const successes: To[] = [];
  const failures: Array<{ item: From; error: Error }> = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successes.push(result.value);
    } else {
      failures.push({
        item: items[index],
        error: result.reason,
      });
    }
  });

  return { successes, failures };
}

// =========================================================================
// TYPE UTILITIES
// =========================================================================

/**
 * Infer DTO type from mapper
 */
export type InferDTO<M> = M extends DTOMapper<any, infer D> ? D : never;

/**
 * Infer Entity type from mapper
 */
export type InferEntity<M> = M extends DTOMapper<infer E, any> ? E : never;

/**
 * Infer View type from mapper
 */
export type InferView<M> = M extends ViewModelMapper<any, infer V> ? V : never;

// =========================================================================
// MAPPER REGISTRY
// =========================================================================

/**
 * Central registry of all mappers in the app.
 * Each feature module registers its mappers.
 * 
 * USAGE:
 * 
 * // Register mappers
 * mapperRegistry.register('player.mapper', new PlayerMapper());
 * mapperRegistry.register('player.viewMapper', new PlayerViewMapper());
 * 
 * // Retrieve mappers
 * const mapper = mapperRegistry.get<PlayerMapper>('player.mapper');
 */

class MapperRegistry {
  private mappers: Map<string, any> = new Map();

  register<T>(key: string, mapper: T): void {
    if (this.mappers.has(key)) {
      console.warn(`Mapper '${key}' already registered, overwriting...`);
    }
    this.mappers.set(key, mapper);
  }

  get<T = any>(key: string): T | undefined {
    return this.mappers.get(key);
  }

  getOrThrow<T = any>(key: string): T {
    const mapper = this.mappers.get(key);
    if (!mapper) {
      throw new Error(`Mapper '${key}' not found in registry`);
    }
    return mapper;
  }

  list(): { key: string; mapper: any }[] {
    return Array.from(this.mappers.entries()).map(([key, mapper]) => ({
      key,
      mapper,
    }));
  }

  clear(): void {
    this.mappers.clear();
  }
}

export const mapperRegistry = new MapperRegistry();

// =========================================================================
// EXPORTS
// =========================================================================

export {
  BaseAdapter,
  APIAdapter,
  DTOMapper,
  ViewModelMapper,
  TransformationPipeline,
  mapperRegistry,
};

export type {
  Adapter,
  Mapper,
  InferDTO,
  InferEntity,
  InferView,
};
