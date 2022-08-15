import request from '@/utils/request';
import Resource from '@/api/resource';

class CompetitiveResource extends Resource {
  constructor() {
    super('competitive');
  }

  show(codId) {
    return request({
      url: '/' + this.uri + '/show',
      method: 'post',
      data: { id: codId },
    });
  }

  }


export { CompetitiveResource as default };
