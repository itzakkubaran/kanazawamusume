#!/bin/sh
# ------------------------------------------------
#   update_html_contents.sh
# ------------------------------------------------
#      test code


# git repository
git_repository=https://github.com/itzakkubaran/kanazawamusume.git
code_name="kanazawamusume"
#dst_dir="/opt/www/html"
dst_dir="/opt/test"
owner="apache:apache"
temp_dir="./temp_work"

# clone to temp_work directory by git
mkdir ${temp_dir}
cd temp_work
echo ${git_repository}
git clone ${git_repository}

rm -R -f ${dst_dir}/${code_name}
cp -p -R -d ${code_name} ${dst_dir}
chown -R ${owner} ${dst_dir}/${code_name}
#
cd -
rm -R -f ${temp_dir}
