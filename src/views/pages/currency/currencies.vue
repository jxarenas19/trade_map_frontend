<script>
    import {required} from "vuelidate/lib/validators";

    import Layout from "../../layouts/main";
    import PageHeader from "@/components/page-header";
    import Resource from "@/api/resource";

    const currencyResource = new Resource('currency');

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
                title: "Monedas",
                items: [
                    {
                        text: "Monedas"
                    }
                ],
                currency: {
                    id: "",
                    name: "",
                    abbreviation: "",
                    exchange_rate: "",
                    default: "",

                },
                submitted: false,
                showmodal: false,
                edit: false

            };
        },
        created() {
            this.getList();
        },
        validations: {
            currency: {
                name: {required},
                exchange_rate: {required},
                abbreviation: {},
                default: {}
            }
        },
        methods: {
            /**
             *
             */
            async getList() {
                this.loading = true;
                try {
                    const {data, total} = await currencyResource.list(this.query);
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
            handleAdd() {
                this.resetForm();
                this.showmodal = true;
            },
            resetForm() {
                this.currency = {
                    id: "",
                    name: "",
                    exchange_rate: "",
                    abbreviation: "",
                    default: ""
                };
            },

            handleEdit(item) {
                this.resetForm();
                this.showmodal = true;
                this.currency = item;
                this.submitted = true;

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
                    const name = this.currency.name;
                    const abbreviation = this.currency.abbreviation;
                    const exchange_rate = this.currency.exchange_rate;
                    const default_status = this.currency.default;
                    var data = {
                        name,
                        abbreviation,
                        exchange_rate,
                        default_status
                    };
                    this.showmodal = false;
                    currencyResource.store(data).then(response => {
                        console.log(response)
                        this.$router.push('/adjust/currencies');
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
                        <div>
                            <a href="javascript:void(0);" class="btn btn-success mb-2" @click="handleAdd">
                                <i class="mdi mdi-plus mr-2"></i> Adicionar Moneda
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
                                    <th>Abreviatura</th>
                                    <th>Tasa de cambio</th>
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
                                    <td>{{ item.abbreviation }}</td>
                                    <td>{{ item.exchange_rate }}</td>
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
                title="Adicionar Moneda"
                title-class="text-dark font-18"
                hide-footer
        >
            <form @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label for="name">Nombre</label>
                    <input
                            id="name"
                            v-model="currency.name"
                            type="text"
                            class="form-control"
                            placeholder="Introduzca el nombre"
                            :class="{ 'is-invalid': submitted && $v.currency.name.$error }"
                    />
                    <div
                            v-if="submitted && !$v.currency.name.required"
                            class="invalid-feedback"
                    >Nombre requerido
                    </div>
                </div>
                <div class="form-group">
                    <label for="endpoint_url">Abreviatura</label>
                    <input
                            id="endpoint_url"
                            v-model="currency.abbreviation"
                            type="text"
                            class="form-control"
                            placeholder="Introduzca la abreviatura"
                            :class="{ 'is-invalid': submitted && $v.currency.abbreviation.$error }"
                    />
                    <div
                            v-if="submitted && !$v.currency.abbreviation.required"
                            class="invalid-feedback"
                    >Abreviatura requerida
                    </div>
                </div>
                <div class="form-group">
                    <label for="endpoint_url">Tasa de cambio</label>
                    <input
                            id="location"
                            v-model="currency.exchange_rate"
                            type="text"
                            class="form-control"
                            placeholder="Introduzca la tasa de cambio"
                            :class="{ 'is-invalid': submitted && $v.currency.exchange_rate.$error }"
                    />
                    <div
                            v-if="submitted && !$v.currency.exchange_rate.required"
                            class="invalid-feedback"
                    >Tasa de cambio requerida
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