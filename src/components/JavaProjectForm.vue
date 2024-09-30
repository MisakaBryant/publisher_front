<template>
  <el-form :model="projectForm" label-width="auto">
    <el-form-item label="Java Path" prop="java_path">
      <el-input v-model="projectForm.java_path"></el-input>
    </el-form-item>
    <el-form-item label="Jar Path" prop="jar_path">
      <el-input v-model="projectForm.jar_path"></el-input>
    </el-form-item>
    <el-form-item label="Config"></el-form-item>
    <div v-for="(config, index) in projectForm.config" :key="index">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Key">
            <el-input v-model="config.key"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Value">
            <el-input v-model="config.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" @click="removeConfig(index)">Remove</el-button>
        </el-col>
      </el-row>
    </div>
    <el-form-item>
      <el-button type="primary" @click="addConfig">AddConfig</el-button>
    </el-form-item>
    <el-form-item label="Properties"></el-form-item>
    <div v-for="(property, index) in projectForm.properties" :key="index">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="Key">
            <el-input v-model="property.key"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Value">
            <el-input v-model="property.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" @click="removeProperty">Remove</el-button>
        </el-col>
      </el-row>
    </div>
    <el-form-item>
      <el-button type="primary" @click="addProperty">AddProperty</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">OK</el-button>
      <el-button @click="onCancel">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import {defineEmits, onMounted, reactive} from 'vue'
import {add_project, get_project, update_project} from "@/js/api.js";
import {ElMessage} from "element-plus";

const props = defineProps({
  project_id: {
    type: String,
    default: ""
  }
})

const emit = defineEmits(['close']);

const projectForm = reactive({
  java_path: "",
  jar_path: "",
  config: [],
  properties: []
})

const addConfig = () => {
  projectForm.config.push({
    key: '',
    value: ''
  })
}

const removeConfig = (index) => {
  projectForm.config.splice(index, 1)
}

const addProperty = () => {
  projectForm.properties.push({
    key: '',
    value: ''
  })
}

const removeProperty = (index) => {
  projectForm.properties.splice(index, 1)
}

const onSubmit = () => {
  // 通过表单构建 project 对象
  console.log(projectForm)
  const project = {
    java_path: projectForm.java_path,
    jar_path: projectForm.jar_path,
    config: new Map(projectForm.config.filter(item => item.key !== "").map(item => [item.key, item.value])),
    properties: new Map(projectForm.properties.filter(item => item.key !== "").map(item => [item.key, item.value]))
  }
  if (props.project_id) {
    // update project
    update_project("java", props.project_id, project).then(res => {
      ElMessage.success("更新成功")
      location.reload()
    })
  } else {
    // create project
    add_project("java", project).then(res => {
      ElMessage.success("创建成功")
      location.reload()
    })
  }
}

const onCancel = () => {
  emit("close")
}

onMounted(() => {
  if (props.project_id) {
    // get project
    get_project("java", props.project_id).then(res => {
      // 通过 project 对象填充表单
      projectForm.java_path = res.data.java_path
      projectForm.jar_path = res.data.jar_path
      projectForm.config = res.data.config.map(item => ({key: item[0], value: item[1]}))
      projectForm.properties = res.data.properties.map(item => ({key: item[0], value: item[1]}))
    })
  }
})

</script>

<style>

</style>
