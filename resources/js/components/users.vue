<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Users Table</h3>

                        <div class="card-tools">
                            <button class="btn btn-success" data-toggle="modal" data-target="#addNew">
                                Add New
                                <i class="fa fa-user-plus"></i>
                            </button>
                        </div>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover">
                            <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>E-mail</th>
                                <th>Type</th>
                                <th>Registered At</th>
                                <th>Modify</th>
                            </tr>
                            <tr v-for="(item,index) in users" :key="index">
                                <td>{{item.id}}</td>
                                <td>{{item.name}}</td>
                                <td>{{item.email}}</td>
                                <td class="text-capitalize">{{item.type}}</td>
                                <td>{{item.created_at | mydate}}</td>
                                <td>
                                    <a href="#">
                                        <i class="fa fa-edit blue"></i>
                                    </a>
                                    /
                                    <a href="#" @click.prevent="deleteuser(item.id)">
                                        <i class="fa fa-trash red"></i>
                                    </a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>

        <!--Modal-->
        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Add New</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="createuser" @keydown="form.onKeydown($event)">
                        <div class="modal-body">

                            <div class="form-group">
                                <input v-model="form.name" placeholder="Name" type="text" name="name"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>

                            <div class="form-group">
                                <input v-model="form.email" placeholder="E-mail Address" type="email" name="email"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>

                            <div class="form-group">
                                <input v-model="form.password" placeholder="Password" type="password" name="password"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                <has-error :form="form" field="password"></has-error>
                            </div>

                            <div class="form-group">
                                <select name="type" v-model="form.type" id="type" class="form-control"
                                        :class="{'is-invalid': form.errors.has('type')}">
                                    <option value="">Select User Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">Standard User</option>
                                    <option value="author">Author</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <textarea class="form-control" v-model="form.bio"
                                          placeholder="Short bio for user (optional)" name="bio"
                                          :class="{'is-invalid': form.errors.has('bio')}"></textarea>
                                <has-error :form="form" field="bio"></has-error>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            <input type="submit" class="btn btn-primary" value="Create">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {bus} from "../app";

    export default {
        data() {
            return {
                users: {},
                form: new Form({
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: ''
                })
            }
        },
        methods: {
            createuser() {
                this.$Progress.start();

                this.form.post('api/user')
                    .then((response) => {
                        bus.$emit('aftercreated');
                        $('#addNew').modal('hide');

                        toast({
                            type: 'success',
                            title: 'User Created Successfully'
                        });
                        this.$Progress.finish();
                    })
                    .catch((err) => {
                        this.$Progress.fail();
                    });


            },
            loadusers() {
                axios.get("api/user")
                    .then(({data}) => {
                        this.users = data.data;
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            deleteuser(id) {
                swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {

                    //Send delete request to the server
                    if (result.value) {
                        this.form.delete('api/user/' + id)
                            .then((response) => {
                                bus.$emit('aftercreated');
                                swal(
                                    'Deleted!',
                                    'Your file has been deleted.',
                                    'success'
                                )
                            })
                            .catch(() => {
                                swal(
                                    'Failed!',
                                    'An error has occurred while deleting this user.',
                                    'warning'
                                )
                            });
                    }
                })
            }
        },
        created() {
            this.loadusers();
            bus.$on('aftercreated', () => {
                this.loadusers();
            });
        }
    }
</script>
