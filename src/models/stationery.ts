export interface IStationeryItem {
  readonly description: string
  getCost(): number
}

export abstract class BaseStationeryItem implements IStationeryItem {
  public readonly description: string
  private readonly unitCost: number

  constructor(description: string, unitCost: number) {
    this.description = description
    this.unitCost = unitCost
  }

  getCost(): number {
    return this.unitCost
  }
}

// Decorator pattern adds quantity-based pricing without changing the base product objects.
export class QuantityDecorator implements IStationeryItem {
  private readonly item: IStationeryItem
  private readonly quantity: number

  constructor(
    item: IStationeryItem,
    quantity: number,
  ) {
    this.item = item
    this.quantity = quantity
  }

  get description(): string {
    return `${this.item.description} x ${this.quantity}`
  }

  getCost(): number {
    return this.item.getCost() * this.quantity
  }
}

export class ExerciseBooks extends BaseStationeryItem {
  constructor() {
    super('Exercise Books', 26)
  }
}

export class Pens extends BaseStationeryItem {
  constructor() {
    super('Pens', 11)
  }
}

export class Pencils extends BaseStationeryItem {
  constructor() {
    super('Pencils', 8)
  }
}

export class Sharpener extends BaseStationeryItem {
  constructor() {
    super('Sharpener', 19)
  }
}

export class GlueSticks extends BaseStationeryItem {
  constructor() {
    super('Glue Sticks', 26)
  }
}
