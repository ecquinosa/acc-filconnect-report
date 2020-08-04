import { Entity, Column, PrimaryGeneratedColumn, Generated, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class Base {
  @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
  id: number;

  @Column({ unique: true })
  @Generated("uuid")
  uuid: string;

  @CreateDateColumn({ name: "created" })
  created: Date;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
    name: "created_by",
  })
  createdBy: string;

  @UpdateDateColumn({ name: "updated" })
  updated: Date;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
    name: "updated_by",
  })
  updatedBy: string;

  @Column({ type: "timestamp", name: "version" })
  version: string;

  @Column({ default: false, name: "is_reversed" })
  isReversed: boolean;
  @Column({ default: false, name: "is_deleted" })
  isDeleted: boolean;
}
