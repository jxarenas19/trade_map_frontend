<script>
import {required} from "vuelidate/lib/validators";

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Resource from "@/api/resource";

const listResource = new Resource('competitive');

/**
 * Analysis Component
 */
export default {
  components: {
    Layout,
    PageHeader
  },
  props: {
    data: {}
  },
  data() {
    return {
      list: [],
      loading: false,
      total: 0,
      query: {
        page: 1,
        limit: 15,
        keyword: '',
      },
      title: "Análisis ",
      items: [
        {
          text: "Análisis "
        }
      ],
      customersData: [
        {
          competitive: "Julio Xavier",
          service: "Service X",
          price: "100"
        },
      ],
      analysis: {
        competitive: "",
        service: "",
        price: ""
      },
      submitted: false,
      showmodal: false
    };
  },
  created() {
    this.getList();
  },
  validations: {
    analysis: {
      competitive: {required},
      service: {required},
      price: {required}
    }
  },
  methods: {
    /**
     *
     */
    async getList() {
      this.loading = true;
      try {
        const { data, total } = await listResource.list(this.query);
        this.list = data;
        this.total = total;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    /**
     * Modal form submit
     */
    // eslint-disable-next-line no-unused-vars
    handleSubmit(e) {
      this.submitted = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } else {
        const competitive = this.analysis.competitive;
        const service = this.analysis.service;
        const price = this.analysis.price;

        this.customersData.push({
          competitive,
          service,
          price
        });
        this.showmodal = false;
      }
      this.submitted = false;
      this.analysis = {};
    },
    /**
     * hode mondal on close
     */
    // eslint-disable-next-line no-unused-vars
    hideModal(e) {
      this.submitted = false;
      this.showmodal = false;
      this.contacts = {};
    },

    /**
     * Filter the data of search
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items"/>
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <!--            <div>-->
            <!--              <a href="javascript:void(0);" class="btn btn-success mb-2" @click="showmodal = true">-->
            <!--                <i class="mdi mdi-plus mr-2"></i> Adicionar Análisis-->
            <!--              </a>-->
            <!--            </div>-->
            <div class="table-responsive mt-3">
              <table
                  class="table table-centered datatable dt-responsive nowrap"
                  style="border-collapse: collapse; border-spacing: 0; width: 100%;"
              >
                <thead class="thead-light">
                <tr>
                  <th style="width: 20px;">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" id="customercheck"/>
                      <label class="custom-control-label" for="customercheck">&nbsp;</label>
                    </div>
                  </th>
                  <th>Competidor</th>
                  <th>Servicio</th>
                  <th>Precio</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in customersData" :key="index">
                  <td>
                    <div class="custom-control custom-checkbox">
                      <input
                          type="checkbox"
                          class="custom-control-input"
                          :id="`customercheck${index}`"
                      />
                      <label class="custom-control-label" :for="`customercheck${index}`">&nbsp;</label>
                    </div>
                  </td>
                  <td>{{ item.competitive }}</td>
                  <td>{{ item.service }}</td>
                  <td>{{ item.price }}</td>
                  <!--                  <td>-->
                  <!--                    <a-->
                  <!--                        href="javascript:void(0);"-->
                  <!--                        class="mr-3 text-primary"-->
                  <!--                        v-b-tooltip.hover-->
                  <!--                        title="Editar"-->
                  <!--                    >-->
                  <!--                      <i class="mdi mdi-pencil font-size-18"></i>-->
                  <!--                    </a>-->
                  <!--                    <a-->
                  <!--                        href="javascript:void(0);"-->
                  <!--                        class="mr-3 text-primary"-->
                  <!--                        v-b-tooltip.hover-->
                  <!--                        title="Sincronizar"-->
                  <!--                    >-->
                  <!--                      <i class="mdi mdi-sync font-size-18"></i>-->
                  <!--                    </a>-->
                  <!--                    <a-->
                  <!--                        href="javascript:void(0);"-->
                  <!--                        class="mr-3 text-danger"-->
                  <!--                        v-b-tooltip.hover-->
                  <!--                        title="Eliminar"-->
                  <!--                    >-->
                  <!--                      <i class="mdi mdi-trash-can font-size-18"></i>-->
                  <!--                    </a>-->
                  <!--                  </td>-->
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <!--    <b-modal-->
    <!--        id="modal-1"-->
    <!--        v-model="showmodal"-->
    <!--        title="Adicionar Ser"-->
    <!--        title-class="text-dark font-18"-->
    <!--        hide-footer-->
    <!--    >-->
    <!--      <form @submit.prevent="handleSubmit">-->
    <!--        <div class="form-group">-->
    <!--          <label for="name">Nombre</label>-->
    <!--          <input-->
    <!--              id="name"-->
    <!--              v-model="analysis .name"-->
    <!--              type="text"-->
    <!--              class="form-control"-->
    <!--              placeholder="Introduzca el nombre"-->
    <!--              :class="{ 'is-invalid': submitted && $v.analysis .name.$error }"-->
    <!--          />-->
    <!--          <div-->
    <!--              v-if="submitted && !$v.analysis .name.required"-->
    <!--              class="invalid-feedback"-->
    <!--          >Nombre requerido-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <div class="row">-->
    <!--          <div class="col-lg-3">-->
    <!--            <div class="form-group mb-3">-->
    <!--              <label for="position">Moneda</label>-->
    <!--              <div>{{ selected }}</div>-->
    <!--              <select v-model="selected">-->
    <!--                <option disabled value="">Seleccione</option>-->
    <!--                <option>CUP</option>-->
    <!--                <option>USD</option>-->
    <!--                <option>EUR</option>-->
    <!--              </select>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--          <div class="col-lg-9">-->
    <!--            <div class="form-group">-->
    <!--              <label for="company">Taza de cambio</label>-->
    <!--              <input-->
    <!--                  id="company"-->
    <!--                  v-model="analysis .exchange_rate"-->
    <!--                  type="text"-->
    <!--                  class="form-control"-->
    <!--                  placeholder="Taza de Cambio"-->
    <!--                  :class="{ 'is-invalid': submitted && $v.analysis .balance.$error }"-->
    <!--              />-->
    <!--              <div-->
    <!--                  v-if="submitted && !$v.analysis .balance.required"-->
    <!--                  class="invalid-feedback"-->
    <!--              >Taza de cambio requerida-->
    <!--              </div>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <div class="form-group">-->
    <!--          <label for="position">EndPoint URL</label>-->
    <!--          <input-->
    <!--              id="position"-->
    <!--              v-model="analysis .endpoint_url"-->
    <!--              type="url"-->
    <!--              class="form-control"-->
    <!--              placeholder="Introduzca la URL"-->
    <!--              :class="{ 'is-invalid': submitted && $v.analysis .date.$error }"-->
    <!--          />-->
    <!--          <div-->
    <!--              v-if="submitted && !$v.analysis .date.required"-->
    <!--              class="invalid-feedback"-->
    <!--          >URL requerida-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <div class="row">-->
    <!--          <div class="col-lg-5">-->
    <!--            <div class="form-group">-->
    <!--              <label for="position">Tipo de obtención de datos</label>-->
    <!--              <div>{{ selected2 }}</div>-->
    <!--              <select v-model="selected2">-->
    <!--                <option disabled value="">Seleccione elemento</option>-->
    <!--                <option>API</option>-->
    <!--                <option>Scraping</option>-->
    <!--              </select>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--          <div class="col-lg-7">-->
    <!--            <div class="form-check">-->
    <!--              <input class="form-check-input" type="checkbox" value id="captcha"/>-->
    <!--              <label class="form-check-label" for="captcha">Cuenta con Captcha en el login</label>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <div class="row">-->
    <!--          <div class="col-lg-6">-->
    <!--            <div class="form-group">-->
    <!--              <label for="name">Usuario</label>-->
    <!--              <input-->
    <!--                  id="user"-->
    <!--                  v-model="analysis .user"-->
    <!--                  type="text"-->
    <!--                  class="form-control"-->
    <!--                  placeholder="Introduzca el usuario"-->
    <!--                  :class="{ 'is-invalid': submitted && $v.analysis .name.$error }"-->
    <!--              />-->
    <!--              <div-->
    <!--                  v-if="submitted && !$v.analysis .name.required"-->
    <!--                  class="invalid-feedback"-->
    <!--              >Usuario requerido-->
    <!--              </div>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--          <div class="col-lg-6">-->
    <!--            <div class="form-group">-->
    <!--              <label for="name">Contraseña</label>-->
    <!--              <input-->
    <!--                  id="password"-->
    <!--                  v-model="analysis .password"-->
    <!--                  type="password"-->
    <!--                  class="form-control"-->
    <!--                  placeholder="Introduzca la contraseña"-->
    <!--                  :class="{ 'is-invalid': submitted && $v.analysis .name.$error }"-->
    <!--              />-->
    <!--              <div-->
    <!--                  v-if="submitted && !$v.analysis .name.required"-->
    <!--                  class="invalid-feedback"-->
    <!--              >Contraseña requerida-->
    <!--              </div>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <div class="text-right">-->
    <!--          <button type="submit" class="btn btn-success">Guardar</button>-->
    <!--          <b-button class="ml-1" variant="danger" @click="hideModal">Cancelar</b-button>-->
    <!--        </div>-->
    <!--      </form>-->
    <!--    </b-modal>-->
    <!-- end modal -->
  </Layout>
</template>