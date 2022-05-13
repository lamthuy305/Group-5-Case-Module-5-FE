import {Component, OnInit} from '@angular/core';
import {ShareJSService} from '../../service/share/share-js.service';
import {HouseService} from '../../service/house/house.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {House} from '../../model/house';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OrderService} from '../../service/order/order.service';
import {NotificationService} from '../../service/notification/notification.service';

@Component({
  selector: 'app-view-house',
  templateUrl: './view-house.component.html',
  styleUrls: ['./view-house.component.css']
})
export class ViewHouseComponent implements OnInit {
  houseFE: House = {};
  currentUser: any = {};


  constructor(private shareJSService: ShareJSService,
              private houseService: HouseService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private orderService:OrderService,
              private notificationService:NotificationService) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      const id = +paramMap.get('id');
      this.getHouseById(id);
    });

  }


  orderForm: FormGroup = new FormGroup({
    house: new FormControl(),
    user: new FormControl(),
    checkIn: new FormControl([Validators.required]),
    checkOut: new FormControl([Validators.required]),
  });

  ngOnInit() {
    this.shareJSService.shareJS();

    this.getCurrentUser();
  }

  private getHouseById(id) {
    this.houseService.getHouseById(id).subscribe(houseBE => {
      this.houseFE = houseBE;
    });
  }

  getCurrentUser() {
    this.currentUser = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(this.currentUser);
  }

  submitCreateOrder() {
    this.orderForm.value.house = {
      id: this.houseFE.id
    };
    this.orderForm.value.user = {
      id: this.currentUser.id
    };
    this.orderService.createOrder(this.orderForm.value).subscribe(() => {
      this.notificationService.showMessage('success', 'Book!', 'Đã gửi yêu cầu đặt homstay thành công, vui lòng chờ admin xác nhận');

    }, error => this.notificationService.showMessage('error', 'Book!', 'Đặt lỗi'));
  }
}
