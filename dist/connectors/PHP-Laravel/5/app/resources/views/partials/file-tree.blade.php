<div class="file-tree">

</div>

@section('extra_scripts')
    <script>
        $(function () {
            $('.fileTree').fileTree({
                root: 'your-upload-folder/',
                script: '{{ url('/you-route-name?_token=' . csrf_token())}}'
            }, function (file) {
                console.log(file);
            });
        });
    </script>
@endsection