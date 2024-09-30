<template>
  <el-container class="layout-container-demo" style="height: 500px">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-openeds="['1']" :default-active="'1-1'">
          <el-sub-menu index="1">
            <template #title>
              <el-icon><message /></el-icon>项目类型
            </template>
            <el-menu-item-group>
              <template #title>Group 1</template>
              <el-menu-item index="1-1" @click="listProject('java')">java</el-menu-item>
              <el-menu-item index="1-2" @click="listProject('web')">web</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group 2">
              <el-menu-item index="1-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
              <template #title>Option4</template>
              <el-menu-item index="1-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><icon-menu /></el-icon>Navigator Two
            </template>
            <el-menu-item-group>
              <template #title>Group 1</template>
              <el-menu-item index="2-1">Option 1</el-menu-item>
              <el-menu-item index="2-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group 2">
              <el-menu-item index="2-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="2-4">
              <template #title>Option 4</template>
              <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><setting /></el-icon>Navigator Three
            </template>
            <el-menu-item-group>
              <template #title>Group 1</template>
              <el-menu-item index="3-1">Option 1</el-menu-item>
              <el-menu-item index="3-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group 2">
              <el-menu-item index="3-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="3-4">
              <template #title>Option 4</template>
              <el-menu-item index="3-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header>
        <el-row :gutter="20" style="display: flex; align-content: center; height: 100%">
          <el-col :span="10">
            <span>Publisher</span>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="addProject">Add</el-button>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <el-scrollbar always>
          <div v-if="type==='java'">
            <JavaProjectTable :projectData="projectData" />
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>

  <el-dialog v-model="showJavaProjectForm" title="新建 java 项目">
    <JavaProjectForm @close="showJavaProjectForm = false" />
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import {list_project} from "@/js/api.js";
import JavaProjectForm from "@/components/JavaProjectForm.vue";
import JavaProjectTable from "@/components/table/JavaProjectTable.vue";

const type = ref("")
const projectData = ref([])
const showJavaProjectForm = ref(false)

const listProject = async (t) => {
  type.value = t
  const res = await list_project(t)
  projectData.value = res.data
  console.log(projectData.value)
}

const addProject = () => {
  if (type.value === "java") {
    showJavaProjectForm.value = true
    console.log(showJavaProjectForm.value)
  }
}

listProject("java")

</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  height: 100%;
}
</style>
