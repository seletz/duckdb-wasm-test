<script setup lang="ts">
 import { ref } from 'vue'
 import TableLite from "vue3-table-lite/ts";
 import { initDB } from '../duckdb.ts'

 const data = ref({
     rows: [],
     columns: [],
     count: 0
 })

 const QUERY= ref("SELECT id, name, age from persons;")

 async function load_db() {
     console.debug("Init DB Dconnection data ...")
     const db = await initDB();
     console.debug("DB: ", db)

     await db.reset()
     await db.registerFileURL("test.csv", "http://localhost:5173/test.csv", 4, false)
     const conn = await db.connect()

     await conn.query("CREATE TABLE persons as select * from read_csv_auto('test.csv');")

     return conn;
 }

 async function load_data(connection) {
     console.debug("Loading data ...")

     const results = await connection.query(QUERY.value)

     console.debug("results: ", results)

     const d = []
     for (let row of results) {
         d.push(row.toJSON())
     }

     console.debug("D: ", d)

     data.value = {
         columns: [
             {label: "ID", field: "id", sortable: true},
             {label: "Name", field: "name", sortable: true},
             {label: "Age", field: "age", sortable: true}
         ],
         sort: {
           order: "id",
             sort: "asc"
         },
         count: d.length,
         rows: d
     }
     console.debug("DATA: ", data.value)
 }


 load_db().then((conn) => load_data(conn))
</script>

<template>
    <h1>DuckDB!</h1>

    <pre>
        {{QUERY}}
    </pre>

    <table-lite
        :columns="data.columns"
        :total="data.count"
        :order="data.sort"
        :rows="data.rows" />

</template>
