<script>
    import Layout from "../../layouts/main";
    import PageHeader from "@/components/page-header";
    import VuejsPaginateNext from "@/components/Pagination";
    import Resource from "@/api/resource";


    const companyResource = new Resource('product_group');
    /**
     * Orders Component
     */
    export default {
        components: {
            Layout,
            PageHeader,
            paginate: VuejsPaginateNext
        },
        data() {
            return {
                title: "Orders",
                items: [
                    {
                        text: "Ecommerce"
                    },
                    {
                        text: "Orders",
                        active: true
                    }
                ],
                list: [],
                totalRows: 1,
                currentPage: 1,
                perPage: 10,
                pageOptions: [10, 25, 50, 100],
                filter: null,
                filterOn: [],
                sortBy: "level_string",
                sortDesc: false,
                query: {
                    page: 1,
                    limit: 10,
                    keyword: '',
                },
                fields: [
                    // {key: "id", sortable: true, label: "ID"},
                    {key: "name", sortable: true, label: "Nombre"},
                    {key: "level_string", sortable: true, label: "Nivel"},
                    // {key: "father_string", sortable: true, label: "Level Superior"}

                ]
            };
        },
        created() {
            this.getList();
        },
        computed: {
            /**
             * Total no. of records
             */
            rows() {
                return this.totalRows;
            }
        },
        methods: {
            /**
             *
             */
            async getList() {
                this.loading = true;
                try {
                    const response = await companyResource.list(this.query);
                    console.log(response)
                    this.list = response.data;
                    this.totalRows = response.pagination.total;
                    this.loading = false;
                } catch (e) {
                    this.loading = false;
                }
            },
            /**
             * Search the table data with search input
             */
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length;
                this.currentPage = 1;
            },
            linkGen(pageNum) {
                console.log(pageNum)
                return pageNum === 1 ? '?' : `?page=${pageNum}`
                // this.getList();
            },
            clickCallback (pageNum)  {
                this.query = {
                    page: pageNum,
                    limit: this.perPage,
                    keyword: '',
                }
                this.getList();
            },
            handleFilter() {
                this.query.keyword = this.filter;
                this.getList();
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
                    <div class="card-body pt-0">
                        <b-tabs nav-class="nav-tabs-custom">
                            <b-tab title-link-class="p-3">
                                <template v-slot:title>
                                    <a class="font-weight-bold active">All Orders</a>
                                </template>
                                <div class="row mt-4">
                                    <div class="col-sm-12 col-md-6">
                                        <div id="tickets-table_length" class="dataTables_length">
                                            <label class="d-inline-flex align-items-center">
                                                Show&nbsp;
                                                <b-form-select v-model="perPage" size="sm"
                                                               :options="pageOptions"></b-form-select>&nbsp;entries
                                            </label>
                                        </div>
                                    </div>
                                    <!-- Search -->
                                    <div class="col-sm-12 col-md-6">
                                        <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                                            <label class="d-inline-flex align-items-center">
                                                Search:
                                                <b-form-input
                                                        v-model="filter"
                                                        type="search"
                                                        @keyup.enter.native="handleFilter"
                                                        class="form-control form-control-sm ml-2"
                                                ></b-form-input>
                                            </label>
                                        </div>
                                    </div>
                                    <!-- End search -->
                                </div>
                                <div class="table-responsive">
                                    <b-table
                                            class="table-centered"
                                            :items="list"
                                            :fields="fields"
                                            responsive="sm"
                                            :per-page="perPage"
                                            :current-page="currentPage"
                                            :sort-by.sync="sortBy"
                                            :sort-desc.sync="sortDesc"

                                            @filtered="onFiltered"
                                    >
                                        <template v-slot:cell(paymentstatus)="row">
                                            <div
                                                    class="badge font-size-12"
                                                    :class="{'badge-soft-danger': `${row.value}` === 'Chargeback',
                            'badge-soft-success': `${row.value}` === 'Paid',
                            'badge-soft-warning': `${row.value}` === 'Unpaid'}"
                                            >{{ row.value}}
                                            </div>
                                        </template>
                                        <template v-slot:cell(invoice)>
                                            <button class="btn btn-light btn-rounded">
                                                Invoice
                                                <i class="mdi mdi-download ml-2"></i>
                                            </button>
                                        </template>
                                        <template v-slot:cell(action)>
                                            <a
                                                    href="javascript:void(0);"
                                                    class="mr-3 text-primary"
                                                    v-b-tooltip.hover
                                                    title="Edit"
                                            >
                                                <i class="mdi mdi-pencil font-size-18"></i>
                                            </a>
                                            <a
                                                    href="javascript:void(0);"
                                                    class="text-danger"
                                                    v-b-tooltip.hover
                                                    title="Delete"
                                            >
                                                <i class="mdi mdi-trash-can font-size-18"></i>
                                            </a>
                                        </template>
                                    </b-table>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <div class="dataTables_paginate paging_simple_numbers float-right">
                                            <ul class="pagination pagination-rounded mb-0">
                                                <!-- pagination -->
<!--                                                <b-pagination-nav :link-gen="linkGen" @change="getList"-->
<!--                                                                  :number-of-pages="10" use-router></b-pagination-nav>-->
<!--                                                <b-pagination v-model="currentPage" :totalRows-rows="1000"-->
<!--                                                              :per-page="perPage" @change="getList"></b-pagination>-->
<!--                                                <pagination v-show="totalRows>0" :total="totalRows" :page.sync="query.page" :limit.sync="query.limit"-->
<!--                                                            @pagination="getList"/>-->
                                                <paginate
                                                        :page-count="perPage"
                                                        :page-range="5"
                                                        :margin-pages="0"
                                                        :clickHandler="clickCallback"
                                                ></paginate>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </b-tab>
                        </b-tabs>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>