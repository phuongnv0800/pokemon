using Microsoft.EntityFrameworkCore.Migrations;

namespace Pokemon.Api.Migrations
{
    public partial class update : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "N",
                table: "MatrixRoutes",
                newName: "Rows");

            migrationBuilder.RenameColumn(
                name: "M",
                table: "MatrixRoutes",
                newName: "Cols");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Rows",
                table: "MatrixRoutes",
                newName: "N");

            migrationBuilder.RenameColumn(
                name: "Cols",
                table: "MatrixRoutes",
                newName: "M");
        }
    }
}
