<template>
    <div>
        <Layout>
            <Content style="min-height: 100vh">
                <div class="container">
                    <h1>自供给监控系统</h1>
                    <Divider />
                    <Tabs>
                        <TabPane label="当前状态"><Info/></TabPane>
                        <TabPane label="设置"><Config/></TabPane>
                    </Tabs>
                </div>
            </Content>
        </Layout>
    </div>
</template>

<script>
import Info from '@/components/Info';
import Config from '@/components/Config';

export default {
    name: 'Index',
    components: {
        Info,
        Config
    }
};
</script>

<style scoped>
.container {
    max-width: 900px;
    margin: 40px auto 0px auto;
    padding: 0px 10px 0px 10px;
}
img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
}
</style>
