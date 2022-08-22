<script>
    import {required} from "vuelidate/lib/validators";

    import Layout from "../../layouts/main";
    import PageHeader from "@/components/page-header";
    import Resource from "@/api/resource";

    const competitiveResource = new Resource('competitive');
    const currencyResource = new Resource('currencies');

    /**
     * Competitive Component
     */
    export default {
        components: {
            Layout,
            PageHeader
        },
        data() {
            return {
                scraping: false,
                api: false,
                list: [],
                loading: false,
                total: 0,
                query: {
                    page: 1,
                    limit: 15,
                    keyword: '',
                },
                title: "Competidores",
                items: [
                    {
                        text: "Competidores"
                    }
                ],
                customersData: [
                    {
                        name: "Julio Xavier",
                        exchange_rate: "1.17",
                        location: "Cuba",
                        status: "ON",
                        last_syncronice: "026/07/2022"
                    },
                ],
                competitive: {
                    id: "",
                    name: "",
                    exchange_rate: "",
                    location: "",
                    status: "",
                    endpoint_url: "",
                    user: "",
                    password: "",
                    last_syncronice: "",
                    type_obtencion_data: "",
                    api_key: "",
                    currency: {
                        id: "",
                        exchange_rate: "",
                        currency: "",
                        type_obtencion_data: "",
                    }
                },
                submitted: false,
                showmodal: false,
                edit: false,
                type_obtencion_data: "",
                options: [
                    {text: 'API', value: 'api_key'},
                    {text: 'Scraping', value: 'scraping'}
                ],
                currencies: []

            };
        },
        created() {
            this.getList();
            this.getCurrencies();
        },
        validations: {
            competitive: {
                name: {required},
                exchange_rate: {required},
                location: {},
                status: {},
                last_syncronice: {},
                endpoint_url: {required},
                user: {},
                password: {},
                api_key: {},
                type_obtencion_data: {required},
                currency: {required},
            }
        },
        methods: {
            /**
             *
             */
            async getList() {
                this.loading = true;
                try {
                    const {data, total} = await competitiveResource.list(this.query);
                    this.list = data;
                    this.total = total;
                    this.loading = false;
                } catch (e) {
                    this.loading = false;
                }
            },


            /**
             *
             */
            async getCurrencies() {
                const {data} = await currencyResource.list();
                this.currencies = data;

            },

            /**
             *
             */
            handleAdd() {
                this.resetForm();
                this.showmodal = true;
            },
            resetForm() {
                this.competitive = {
                    id: "",
                    name: "",
                    exchange_rate: "",
                    location: "",
                    status: true,
                    endpoint_url: "",
                    user: "",
                    password: "",
                    last_syncronice: "",
                    type_obtencion_data: "",
                    api_key: "",
                    currency: {
                        id: "",
                        exchange_rate: "",
                        currency: "",
                        type_obtencion_data: "",
                    }
                };
            },

            handleEdit(item) {
                this.resetForm();
                this.showmodal = true;

                this.competitive = item;
                this.competitive.exchange_rate = item.currency.exchange_rate;
                this.submitted = true;
                console.log(item);

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
                    console.log(this.$v)
                    return;
                } else {
                    const name = this.competitive.name;
                    const currency_id = this.competitive.currency;
                    const location = this.competitive.location;
                    const status = this.competitive.status;
                    const user = this.competitive.user;
                    const password = this.competitive.password;
                    const endpoint_url = this.competitive.endpoint_url;
                    const api_key = this.competitive.api_key;
                    const type_obtencion_data = this.competitive.type_obtencion_data;
                    var data = {
                        name,
                        currency_id,
                        location,
                        status,
                        user,
                        password,
                        endpoint_url,
                        type_obtencion_data,
                        api_key
                    };
                    this.showmodal = false;
                    competitiveResource.store(data).then(response => {
                        console.log(response)
                        this.$router.push('/competitive');
                    }).catch(error => {
                        console.log(error);
                    }).finally(() => {
                        this.loading = false;
                    });
                }
                this.hideModal();
            },


            /**
             * hode mondal on close
             */
            // eslint-disable-next-line no-unused-vars
            hideModal() {
                this.submitted = false;
                this.showmodal = false;
                this.contacts = {};
                this.api = false;
                this.scraping = false;
                this.competitive = {};
            },

            /**
             * Filter the data of search
             */
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length;
                this.currentPage = 1;
            },

            typeSelect(val) {
                if (val.target.options[val.target.options.selectedIndex].text === 'Scraping') {
                    this.scraping = true;
                    this.api = false;
                } else {
                    this.scraping = false;
                    this.api = true;
                }
            },
            currencySelect(val){
                var option = val.target.options[val.target.options.selectedIndex];
                this.competitive.exchange_rate = this.currencies[option.index].exchange_rate;
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
                        <div>
                            <a href="javascript:void(0);" class="btn btn-success mb-2" @click="handleAdd">
                                <i class="mdi mdi-plus mr-2"></i> Adicionar Competidor
                            </a>
                        </div>
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
                                    <th>Nombre</th>
                                    <th>Tasa de cambio actual</th>
                                    <th>Localización</th>
                                    <th>Estado(ON/OFF)</th>
                                    <th>Ultima sincronización</th>
                                    <th style="width: 120px;">Operaciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item, index) in list" :key="index">
                                    <td>
                                        <div class="custom-control custom-checkbox">
                                            <input
                                                    type="checkbox"
                                                    class="custom-control-input"
                                                    :id="`customercheck${index}`"
                                            />
                                            <label class="custom-control-label"
                                                   :for="`customercheck${index}`">&nbsp;</label>
                                        </div>
                                    </td>
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.currency.exchange_rate }}</td>
                                    <td>{{ item.location }}</td>
                                    <td>{{ item.status }}</td>
                                    <td>{{ item.last_syncronice }}</td>
                                    <td>
                                        <a
                                                href="javascript:void(0);"
                                                @click="handleEdit(item)"
                                                class="mr-3 text-primary"
                                                v-b-tooltip.hover
                                                title="Editar"
                                        >
                                            <i class="mdi mdi-pencil font-size-18"></i>
                                        </a>
                                        <a
                                                href="javascript:void(0);"
                                                class="mr-3 text-primary"
                                                v-b-tooltip.hover
                                                title="Sincronizar"
                                        >
                                            <i class="mdi mdi-sync font-size-18"></i>
                                        </a>
                                        <a
                                                href="javascript:void(0);"
                                                class="mr-3 text-danger"
                                                v-b-tooltip.hover
                                                title="Eliminar"
                                        >
                                            <i class="mdi mdi-trash-can font-size-18"></i>
                                        </a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <b-modal
                id="modal-1"
                v-model="showmodal"
                title="Adicionar Competidor"
                title-class="text-dark font-18"
                hide-footer
        >
            <form @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label for="name">Nombre</label>
                    <input
                            id="name"
                            v-model="competitive.name"
                            type="text"
                            class="form-control"
                            placeholder="Introduzca el nombre"
                            :class="{ 'is-invalid': submitted && $v.competitive.name.$error }"
                    />
                    <div
                            v-if="submitted && !$v.competitive.name.required"
                            class="invalid-feedback"
                    >Nombre requerido
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3">
                        <div class="form-group mb-3">
                            <label for="currency">Moneda</label>
                            <select id="currency" v-model="competitive.currency_id" @change="currencySelect">
                                <option v-for="(option, index) in currencies" :value="option['id']" v-bind:key="option['id']" :index="index">
                                    {{ option['abbreviation'] }}
                                </option>

                            </select>
                        </div>
                    </div>
                    <div class="col-lg-9">
                        <div class="form-group">
                            <label for="exchange_rate">Taza de cambio</label>
                            <input
                                    id="exchange_rate"
                                    v-model="competitive.exchange_rate"
                                    type="text"
                                    class="form-control"
                                    placeholder="Taza de Cambio"
                                    :readonly="true"
                                    :class="{ 'is-invalid': submitted && $v.competitive.exchange_rate.$error }"
                            />
                            <div
                                    v-if="submitted && !$v.competitive.exchange_rate.required"
                                    class="invalid-feedback"
                            >Taza de cambio requerida
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="endpoint_url">EndPoint URL</label>
                    <input
                            id="endpoint_url"
                            v-model="competitive.endpoint_url"
                            type="url"
                            class="form-control"
                            placeholder="Introduzca la URL"
                            :class="{ 'is-invalid': submitted && $v.competitive.endpoint_url.$error }"
                    />
                    <div
                            v-if="submitted && !$v.competitive.endpoint_url.required"
                            class="invalid-feedback"
                    >URL requerida
                    </div>
                </div>
                <div class="form-group">
                    <label for="endpoint_url">Localización</label>
                    <input
                            id="location"
                            v-model="competitive.location"
                            type="text"
                            class="form-control"
                            placeholder="Introduzca la Localización"
                            :class="{ 'is-invalid': submitted && $v.competitive.location.$error }"
                    />
                    <div
                            v-if="submitted && !$v.competitive.location.required"
                            class="invalid-feedback"
                    >URL requerida
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-5">
                        <div class="form-group">
                            <label for="type_obtencion_data">Tipo de obtención de datos</label>
                            <select id="type_obtencion_data" v-model="competitive.type_obtencion_data" @change="typeSelect">
                                <option v-for="option in options" :value="option.value" v-bind:key="option.value">
                                    {{ option.text }}
                                </option>

                            </select>
                        </div>
                    </div>
                    <div class="col-lg-7" v-show="scraping">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value id="captcha"/>
                            <label class="form-check-label" for="captcha">Cuenta con Captcha en el login</label>
                        </div>
                    </div>
                </div>
                <div class="row" v-show="scraping">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="user">Usuario</label>
                            <input
                                    id="user"
                                    v-model="competitive.user"
                                    type="text"
                                    class="form-control"
                                    placeholder="Introduzca el usuario"
                                    :class="{ 'is-invalid': submitted && $v.competitive.name.$error }"
                            />
                            <div
                                    v-if="submitted && !$v.competitive.name.required"
                                    class="invalid-feedback"
                            >Usuario requerido
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <input
                                    id="password"
                                    v-model="competitive.password"
                                    type="password"
                                    class="form-control"
                                    placeholder="Introduzca la contraseña"
                                    :class="{ 'is-invalid': submitted && $v.competitive.name.$error }"
                            />
                            <div
                                    v-if="submitted && !$v.competitive.name.required"
                                    class="invalid-feedback"
                            >Contraseña requerida
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" v-show="api">
                    <div class="col-lg-12">
                        <div class="form-group">
                            <label for="api_key">API key</label>
                            <input
                                    id="api_key"
                                    v-model="competitive.api_key"
                                    type="text"
                                    class="form-control"
                                    placeholder="Introduzca el API KEY"
                                    :class="{ 'is-invalid': submitted && $v.competitive.endpoint_url.$error }"
                            />
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <button type="submit" class="btn btn-success">Guardar</button>
                    <b-button class="ml-1" variant="danger" @click="hideModal">Cancelar</b-button>
                </div>
            </form>
        </b-modal>
        <!-- end modal -->
    </Layout>
</template>