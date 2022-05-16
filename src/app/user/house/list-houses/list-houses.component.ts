import {Component, OnInit} from '@angular/core';
import {House} from '../../../model/house';
import {Type} from '../../../model/type';
import {StatusHouse} from '../../../model/status-house';
import {HouseService} from '../../../service/house/house.service';
import {TypeService} from '../../../service/type/type.service';
import {StatusHouseService} from '../../../service/StatusHouse/status-house.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../../service/notification/notification.service';
import {CityService} from '../../../service/city/city.service';
import {FormControl, FormGroup} from '@angular/forms';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-list-houses',
  templateUrl: './list-houses.component.html',
  styleUrls: ['./list-houses.component.css']
})
export class ListHousesComponent implements OnInit {
  houses: House[] = [];
  types: Type[] = [];
  cities: any[] = [];
  statusHouses: StatusHouse[] = [];
  house: House = {};
  currentUser: any = {};
  selectedFile: File[] = [];
  houseEdit: House = {};
  houseEdit_Id: number = 0;

  constructor(private houseService: HouseService,
              private typeService: TypeService,
              private statusHouseService: StatusHouseService,
              private router: Router,
              private notificationService: NotificationService,
              private cityService: CityService) {
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  retsetHouseEdit() {
    this.houseForm.reset();
  }

  houseForm: FormGroup = new FormGroup({
    id: new FormControl(),
    name: new FormControl(''),
    area: new FormControl(''),
    city: new FormControl(null),
    location: new FormControl(''),
    bedroom: new FormControl(''),
    bathroom: new FormControl(''),
    price: new FormControl(''),
    description: new FormControl(''),
    img: new FormControl(),
    images: new FormControl(),
    statusHouse: new FormControl(null),
    type: new FormControl(null),
  });

  houseFormEdit: FormGroup = new FormGroup({
    id_edit: new FormControl(),
    name_edit: new FormControl(''),
    area_edit: new FormControl(''),
    city_edit: new FormControl(null),
    location_edit: new FormControl(''),
    bedroom_edit: new FormControl(''),
    bathroom_edit: new FormControl(''),
    price_edit: new FormControl(''),
    description_edit: new FormControl(''),
    img_edit: new FormControl(),
    statusHouse_edit: new FormControl(null),
    type_edit: new FormControl(null),
  });


  getCurrentUser() {
    this.currentUser = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.currentUser);
    this.getAllHouses();
    this.getAllStatusHouse();
    this.getAllTypes();
    this.getAllCity();
  }

  getAllHouses() {
    this.houseService.getAll(this.currentUser.id).subscribe((listHouse) => {
      this.houses = listHouse;
    }, error => {
    });
  }

  viewHouseById(id) {
    this.router.navigateByUrl('/view/' + id);
  }


  getHouseById(id) {
    this.houseService.getHouseById(id).subscribe((houseBE) => {
      this.houseEdit = houseBE;
      console.log(this.houseEdit);
      this.houseEdit_Id = id;
      console.log(this.houseEdit_Id);
      this.nameControl.setValue(this.houseEdit.name);
      this.areaControl.setValue(this.houseEdit.area);
      this.cityControl.setValue(this.houseEdit.city);
      this.locationControl.setValue(this.houseEdit.location);
      this.bedroomControl.setValue(this.houseEdit.bedroom);
      this.bathroomControl.setValue(this.houseEdit.bathroom);
      this.priceControl.setValue(this.houseEdit.price);
      this.descriptionControl.setValue(this.houseEdit.description);
      this.statusHouseControl.setValue(this.houseEdit.statusHouse);
      this.typeControl.setValue(this.houseEdit.type);
    }, error => {
    });
  }


  createHouse() {
    const house = new FormData();
    if (this.houseEdit_Id > 0) {
      house.append('id', this.houseEdit_Id.toFixed());
    }
    house.append('name', this.houseForm.value.name);
    house.append('area', this.houseForm.value.area);
    house.append('city', this.houseForm.value.city);
    house.append('location', this.houseForm.value.location);
    house.append('bedroom', this.houseForm.value.bedroom);
    house.append('bathroom', this.houseForm.value.bathroom);
    house.append('price', this.houseForm.value.price);
    house.append('description', this.houseForm.value.description);
    const files = (document.getElementById('img') as HTMLInputElement).files;
    if (files.length > 0) {
      house.append('img', files[0]);
    }
    if (this.selectedFile.length > 0) {
      for (let i = 0; i < this.selectedFile.length; i++) {
        house.append('images', this.selectedFile[i]);
      }
    }
    house.append('statusHouse', this.houseForm.value.statusHouse);
    house.append('type', this.houseForm.value.type);
    house.append('user', this.currentUser.id);
    if (this.houseForm.valid) {
      this.houseService.createHouse(house).subscribe(() => {
          this.notificationService.showMessage('success', 'Create!!', 'Tạo mới thành công');
          this.getAllHouses();
        }, error => this.notificationService.showMessage('error', 'Xảy ra lỗi!', 'Vui lòng kiểm tra lại thông tin vừa nhập')
      );
    }
  }


  changeFile($event) {
    this.selectedFile = $event.target.files;
  }


  getAllTypes() {
    this.typeService.getAll().subscribe((listType) => {
      this.types = listType;
    });
  }

  getAllCity() {
    this.cityService.getAll().subscribe((citiesBE) => {
      this.cities = citiesBE;
    });
  }

  getAllStatusHouse() {
    this.statusHouseService.getAll().subscribe((listStatusOfHouse) => {
      this.statusHouses = listStatusOfHouse;
    }, error => {
    });
  }

  delete(id) {
    Swal.fire({
      title: 'Bạn có muốn xóa?',
      text: 'You wont be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
          this.houseService.deleteHouse(id).subscribe(() => {
            this.notificationService.showMessage('success', 'Delete!!', 'Xóa thành công');
            this.getAllHouses();
          }, error =>
            this.notificationService.showMessage('erros', 'Delete!', 'Xóa lỗi'));
        }
      }
    );
  }

  get idControl() {
    return this.houseFormEdit.get('editId');
  }

  get nameControl() {
    return this.houseFormEdit.get('editName');
  }

  get areaControl() {
    return this.houseFormEdit.get('editArea');
  }

  get cityControl() {
    return this.houseFormEdit.get('editCity');
  }

  get locationControl() {
    return this.houseFormEdit.get('editLocation');
  }

  get bedroomControl() {
    return this.houseFormEdit.get('editBedroom');
  }

  get bathroomControl() {
    return this.houseFormEdit.get('editBathroom');
  }

  get priceControl() {
    return this.houseFormEdit.get('editPrice');
  }

  get descriptionControl() {
    return this.houseFormEdit.get('editDescription');
  }

  get imgControl() {
    return this.houseFormEdit.get('editImg');
  }

  get statusHouseControl() {
    return this.houseFormEdit.get('editStatusHouse');
  }

  get typeControl() {
    return this.houseFormEdit.get('editType');
  }

  editHouse() {
    const house = new FormData();
    if (this.houseEdit_Id > 0) {
      house.append('id', this.houseEdit_Id.toFixed());
    }
    house.append('name', this.houseFormEdit.value.name);
    house.append('area', this.houseFormEdit.value.area);
    house.append('city', this.houseFormEdit.value.city.id);
    house.append('location', this.houseFormEdit.value.location);
    house.append('bedroom', this.houseFormEdit.value.bedroom);
    house.append('bathroom', this.houseFormEdit.value.bathroom);
    house.append('price', this.houseFormEdit.value.price);
    house.append('description', this.houseFormEdit.value.description);
    const files = (document.getElementById('editImg') as HTMLInputElement).files;
    if (files.length > 0) {
      house.append('img', files[0]);
    }
    house.append('statusHouse', this.houseFormEdit.value.statusHouse.id);
    house.append('type', this.houseFormEdit.value.type.id);
    house.append('user', this.currentUser.id);
    if (this.houseForm.valid) {
      this.houseService.createHouse(house).subscribe(() => {
          this.notificationService.showMessage('success', 'Create!!', 'Tạo mới thành công');
          this.getAllHouses();
        }, error => this.notificationService.showMessage('error', 'Xảy ra lỗi!', 'Vui lòng kiểm tra lại thông tin vừa nhập')
      );
    }
  }
}
