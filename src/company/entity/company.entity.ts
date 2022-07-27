import { Field, ObjectType } from "@nestjs/graphql";
import { Department } from "src/department/entity/department.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'crm_companies'
})
@ObjectType()
export class Company {
  @Field()
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({
    unique: true
  })
  name: string

  @Field({
    nullable: true
  })
  @Column({
    name: 'phone_number'
  })
  phoneNumber: string

  @Field({
    nullable: true
  })
  @Column({
    name: 'fax_number'
  })
  faxNumber: string

  @Field({
    nullable: true
  })
  @Column()
  email: string

  @Field({
    nullable: true
  })
  @Column()
  address: string

  @Field({
    nullable: true
  })
  @Column()
  website: string

  @Field({
    nullable: true
  })
  @Column({
    name: 'small_logo'
  })
  smallLogo: string

  @Field({
    nullable: true
  })
  @Column({
    name: 'medium_logo'
  })
  mediumLogo: string

  @Field({
    nullable: true
  })
  @Column({
    name: 'large_logo'
  })
  largeLogo: string

  @Field(type => [Department])
  @OneToMany(() => Department, x => x.company)
  departments: Department[]
}