<template>
    <div class="filter-container">
        <el-input v-model="query.keyword" placeholder="nombre" style="width: 200px;" class="filter-item"
                  @keyup.enter.native="handleFilter"/>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        </el-button>
        <router-link :to="linkCrearNuevo">
            <el-button type="primary" icon="el-icon-plus"
                       v-permission="['gestionar nomencladores']" class="filter-item" style="margin-left: 10px;">
                {{labelBotonCrearNuevo}}
            </el-button>
        </router-link>
    </div>
</template>
<script>
export default {
  name: 'filtro',
  props: {
    handleFilter: {},
    query: {},
    linkCrearNuevo: {
      type: String,
      default: '/', // '/nomencladores/seriefacturacion/crear'
    },
    labelBotonCrearNuevo: {
      type: String,
      default: 'Nuevo',
    },
  },
};
</script>
