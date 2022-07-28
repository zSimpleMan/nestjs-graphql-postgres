import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, BaseEntity as BaseEntityORM } from "typeorm";

@ObjectType()
export class BaseEntity extends BaseEntityORM {
  @Field({ nullable: true})
  @Column()
  status: number

  @Field({ nullable: true})
  @Column({
    name: 'created_at'
  })
  createdAt: Date

  @Field({ nullable: true})
  @Column({
    name: 'modified_at'
  })
  modifiedAt: Date

  @Field({ nullable: true})
  @Column({
    name: 'created_by'
  })
  createdBy: number

  @Field({ nullable: true})
  @Column({
    name: 'modified_by'
  })
  modifiedBy: number

  @Field({ nullable: true})
  @Column({
    name: 'is_deleted'
  })
  isDeleted: boolean
}