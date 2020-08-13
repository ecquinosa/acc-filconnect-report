import { Entity, Column, OneToMany, Generated } from "typeorm";
import { Base } from "./Base";
//import { MemberAddress } from "./memberAddress";

@Entity({ name: "KycSearchCitizen" })
export class KycSearchCitizen extends Base {

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
  })
  memberId: string; 
    
  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",    
    nullable: true
  })
  userProfileId: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
  })
  institutionId: string;  

  @Column({
    length: 50,
  })
  lastName: string;

  @Column({
    length: 50,
  })
  firstName: string;

  @Column({
    length: 50,
    nullable: true
  })
  middleName: string;

  @Column({
    length: 10,
    nullable: true
  })
  suffix: string;

  @Column({
    length: 6,
    nullable: true
  })
  gender: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
  })
  civilStatusId: string;

  @Column({
    length: 20,
  })
  civilStatus: string;

  @Column()
  birthDate: Date;

  @Column({
    default: "0000",
    length: 10,
  }) 
  birthDay: string;
  
  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
  })
  birthCityId: string;

  @Column({
    length: 40,
  })
  birthCity: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
  })
  birthProvinceId: string;

  @Column({
    length: 40,
  })
  birthProvince: string;

  @Column()
  noOfChildren: number;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
    nullable: true,
  })
  employmentStatusId: string;

  @Column({
    length: 50,
    nullable: true,
  })
  employmentStatus: string;

  @Column()
  isRegisteredVoter: boolean;

  @Column({
    default: false,
  }
  )
  isPwd: boolean;

  @Column({
    default: false,
  }
  )
  isDependent: boolean; 

  @Column({
    length: 50,
    nullable: true,
  })
  presentRoomFloorUnitBldg: string;

  @Column({
    length: 50,
    nullable: true,
  })
  presentHouseLotBlock: string;

  @Column({
    length: 50,
    nullable: true,
  })
  presentStreetname: string;

  @Column({
    length: 50,
    nullable: true,
  })
  presentSubdivision: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
    nullable: true,
  })
  presentBarangayId: string;

  @Column({
    length: 50,
    nullable: true,
  })
  presentBarangay: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
  })  
  presentCityId: string;

  @Column({
    length: 100,
  })
  presentCity: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
  })  
  presentProvinceId: string;

  @Column({
    length: 100,
  })
  presentProvince: string;  

  @Column({
    length: 6,
  })
  presentPostal: string;

  @Column({
    default: "00000000-0000-0000-0000-000000000000",
    type: "uniqueidentifier",
  })  
  presentDistrictId: string;

  @Column({
    length: 50,
    nullable: true
  })
  presentDistrict: string;

  @Column({
    length: 20,
    nullable: true,
  })
  telephoneNos: string;

  @Column({
    length: 20,
    nullable: true,
  })
  mobileNos: string;

  @Column({
    length: 50,
    nullable: true,
  })
  email: string;

}
