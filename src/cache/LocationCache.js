/**
 * Created by queue on 2017/8/2.
 */
import {httpGet} from '../api/requestService'
import Conf from '../apiconf'

export function provinceCache(obj) {
  if (localStorage['province'] && localStorage['province'].length > 0) {
    return new Promise(function (resolve, reject) {
      resolve({
        code: 0,
        response: JSON.parse(localStorage['province'])
      });
    });
  } else {
    return httpGet('/province', Conf.locationDomain)(obj).then(res => {
      if (res.code === 0) {
        localStorage['province'] = JSON.stringify(res.response);
      }
      return res;
    });
  }
}

export function cityCache(obj) {
  let val = obj.provinceID;
  if (localStorage['city' + val] && localStorage['city' + val].length > 0) {
    return new Promise(function (resolve, reject) {
      resolve({
        code: 0,
        response: JSON.parse(localStorage['city' + val])
      });
    });
  } else {
    return httpGet('/city', Conf.locationDomain)(obj).then(res => {
      if (res.code === 0) {
        localStorage['city' + val] = JSON.stringify(res.response);
      }
      return res;
    });
  }
}
export function areaCache(obj) {
  let val = obj.cityID;
  if (localStorage['area' + val] && localStorage['area' + val].length > 0) {
    return new Promise(function (resolve, reject) {
      resolve({
        code: 0,
        response: JSON.parse(localStorage['area' + val])
      });
    });
  } else {
    return httpGet('/town', Conf.locationDomain)(obj).then(res => {
      if (res.code === 0) {
        localStorage['area' + val] = JSON.stringify(res.response);
      }
      return res;
    });
  }
}
