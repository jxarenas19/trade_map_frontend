<script>
    import {required} from "vuelidate/lib/validators";

    import Layout from "../../layouts/main";
    import PageHeader from "@/components/page-header";
    import Resource from "@/api/resource";

    const userResource = new Resource('user');

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
                title: "Usuarios",
                items: [
                    {
                        text: "Usuarios"
                    }
                ],
                user: {
                    id: "",
                    email: "",
                    password: "",
                    full_name: "",
                    active: "",
                    roles: "",
                    roles_string: "",

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
            user: {
                email: {required},
                password: {required},
                full_name: {required},
                active: {},
                roles: ""
            }
        },
        methods: {
            /**
             *
             */
            async getList() {
                this.loading = true;
                try {
                    const {data, total} = await userResource.list(this.query);
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
                this.user = {
                    id: "",
                    email: "",
                    password: "",
                    active: "",
                    roles: ""
                };
            },

            handleEdit(item) {
                this.resetForm();
                this.showmodal = true;
                this.user = item;
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
                    const email = this.user.email;
                    const password = this.user.password;
                    const full_name = this.user.full_name;
                    const active = this.user.active;
                    const roles = this.user.roles;
                    var data = {
                        email,
                        password,
                        full_name,
                        active,
                        roles
                    };
                    this.showmodal = false;
                    userResource.store(data).then(response => {
                        console.log(response)
                        this.$router.push('/adjust/users');
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
                                <i class="mdi mdi-plus mr-2"></i> Adicionar Usuario
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
                                    <th>Email</th>
                                    <th>Nombre</th>
                                    <th>Activo</th>
                                    <th>Roles</th>
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
                                    <td>{{ item.email }}</td>
                                    <td>{{ item.full_name }}</td>
                                    <td>{{ item.active }}</td>
                                    <td>{{ item.roles_string }}</td>
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
                    <label for="email">Usuario</label>
                    <input
                            id="email"
                            v-model="user.email"
                            type="text"
                            class="form-control"
                            placeholder="Introduzca el usuario"
                            :class="{ 'is-invalid': submitted && $v.user.name.$error }"
                    />
                    <div
                            v-if="submitted && !$v.user.email.required"
                            class="invalid-feedback"
                    >Usuario requerido
                    </div>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                            id="password"
                            v-model="user.password"
                            type="password"
                            class="form-control"
                            placeholder="Introduzca la contraseña"
                            :class="{ 'is-invalid': submitted && $v.user.password.$error }"
                    />
                    <div
                            v-if="submitted && !$v.user.abbreviation.required"
                            class="invalid-feedback"
                    >Contraseña requerida
                    </div>
                </div>
                <div class="form-group">
                    <label for="full_name">Nombre</label>
                    <input
                            id="full_name"
                            v-model="user.full_name"
                            type="text"
                            class="form-control"
                            placeholder="Introduzca el nombre"
                            :class="{ 'is-invalid': submitted && $v.user.name.$error }"
                    />
                    <div
                            v-if="submitted && !$v.user.email.required"
                            class="invalid-feedback"
                    >Nombre requerido
                    </div>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value id="active"/>
                    <label class="form-check-label" for="active">Activo</label>
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